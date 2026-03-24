import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/BottomNav";

function useConversations() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["conversations", profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          participant_one_profile:profiles!conversations_participant_one_fkey(id, full_name, display_name, avatar_url),
          participant_two_profile:profiles!conversations_participant_two_fkey(id, full_name, display_name, avatar_url)
        `)
        .or(`participant_one.eq.${profile.id},participant_two.eq.${profile.id}`)
        .order("last_message_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((conv: any) => {
        const other =
          conv.participant_one === profile.id
            ? conv.participant_two_profile
            : conv.participant_one_profile;
        return { ...conv, otherUser: other };
      });
    },
    enabled: !!profile,
  });
}

function useLastMessages(conversationIds: string[]) {
  return useQuery({
    queryKey: ["lastMessages", conversationIds],
    queryFn: async () => {
      if (conversationIds.length === 0) return {};
      const results: Record<string, any> = {};
      // Fetch last message for each conversation
      for (const cid of conversationIds) {
        const { data } = await supabase
          .from("messages")
          .select("content, created_at, sender_profile_id, is_read")
          .eq("conversation_id", cid)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) results[cid] = data;
      }
      return results;
    },
    enabled: conversationIds.length > 0,
  });
}

export default function Inbox() {
  const { data: conversations, isLoading } = useConversations();
  const conversationIds = (conversations || []).map((c: any) => c.id);
  const { data: lastMessages } = useLastMessages(conversationIds);
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  const filtered = (conversations || []).filter((c: any) => {
    if (!searchQuery) return true;
    const name = c.otherUser?.display_name || c.otherUser?.full_name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Link to="/home" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-lg font-bold">Messages</h1>
        </div>
      </header>

      <div className="px-4 pt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full"
          />
        </div>
      </div>

      <div className="px-4 pt-4 space-y-1">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-display font-semibold">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start a conversation from a pro's profile
            </p>
          </div>
        ) : (
          filtered.map((conv: any) => {
            const last = lastMessages?.[conv.id];
            const name = conv.otherUser?.display_name || conv.otherUser?.full_name || "User";
            const isUnread = last && !last.is_read && last.sender_profile_id !== profile?.id;
            return (
              <Link
                key={conv.id}
                to={`/messages/${conv.id}`}
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-secondary/50 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                  {conv.otherUser?.avatar_url ? (
                    <img src={conv.otherUser.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display font-bold text-primary">{name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold text-sm truncate ${isUnread ? "text-foreground" : ""}`}>
                      {name}
                    </p>
                    {last && (
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {timeAgo(last.created_at)}
                      </span>
                    )}
                  </div>
                  {last && (
                    <p className={`text-xs truncate mt-0.5 ${isUnread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {last.sender_profile_id === profile?.id ? "You: " : ""}
                      {last.content}
                    </p>
                  )}
                </div>
                {isUnread && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
                )}
              </Link>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
