import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function useConversation(id: string | undefined) {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          participant_one_profile:profiles!conversations_participant_one_fkey(id, full_name, display_name, avatar_url),
          participant_two_profile:profiles!conversations_participant_two_fkey(id, full_name, display_name, avatar_url)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      const other =
        data.participant_one === profile?.id
          ? (data as any).participant_two_profile
          : (data as any).participant_one_profile;
      return { ...data, otherUser: other };
    },
    enabled: !!id && !!profile,
  });
}

function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!conversationId,
  });
}

export default function ConversationPage() {
  const { id } = useParams();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { data: conversation, isLoading: convLoading } = useConversation(id);
  const { data: messages, isLoading: msgsLoading } = useMessages(id);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  // Realtime subscription
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`messages-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["messages", id] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id, queryClient]);

  // Mark messages as read
  useEffect(() => {
    if (!messages || !profile) return;
    const unread = messages.filter(
      (m: any) => !m.is_read && m.sender_profile_id !== profile.id
    );
    if (unread.length > 0) {
      supabase
        .from("messages")
        .update({ is_read: true })
        .in("id", unread.map((m: any) => m.id))
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          queryClient.invalidateQueries({ queryKey: ["lastMessages"] });
        });
    }
  }, [messages, profile]);

  const handleSend = async () => {
    if (!text.trim() || !profile || !id) return;
    setSending(true);
    try {
      await supabase.from("messages").insert({
        conversation_id: id,
        sender_profile_id: profile.id,
        content: text.trim(),
      });
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", id);
      setText("");
      queryClient.invalidateQueries({ queryKey: ["messages", id] });
    } catch {
    } finally {
      setSending(false);
    }
  };

  const otherName = conversation?.otherUser?.display_name || conversation?.otherUser?.full_name || "User";

  if (convLoading) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-[60vh] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Link to="/messages" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {conversation?.otherUser?.avatar_url ? (
              <img src={conversation.otherUser.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display font-bold text-primary text-sm">{otherName.charAt(0)}</span>
            )}
          </div>
          <p className="font-display font-semibold text-sm">{otherName}</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {msgsLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className={cn("h-10 rounded-2xl", i % 2 === 0 ? "w-3/4" : "w-2/3 ml-auto")} />
          ))
        ) : messages?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
          </div>
        ) : (
          messages?.map((msg: any) => {
            const isMine = msg.sender_profile_id === profile?.id;
            return (
              <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-foreground rounded-bl-md"
                  )}
                >
                  <p>{msg.content}</p>
                  <p className={cn("text-[10px] mt-1", isMine ? "text-primary-foreground/60" : "text-muted-foreground")}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 glass border-t border-border/50 p-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-full flex-1"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
