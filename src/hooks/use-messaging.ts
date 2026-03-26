import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useStartConversation() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherProfileId: string) => {
      if (!profile) throw new Error("Not logged in");

      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .or(
          `and(participant_one.eq.${profile.id},participant_two.eq.${otherProfileId}),and(participant_one.eq.${otherProfileId},participant_two.eq.${profile.id})`
        )
        .maybeSingle();

      if (existing) return existing.id;

      const { data, error } = await supabase
        .from("conversations")
        .insert({
          participant_one: profile.id,
          participant_two: otherProfileId,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useUnreadCount() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: count = 0 } = useQuery({
    queryKey: ["unreadMessages", profile?.id],
    queryFn: async () => {
      if (!profile) return 0;

      // Get all conversations this user is part of
      const { data: convos } = await supabase
        .from("conversations")
        .select("id")
        .or(`participant_one.eq.${profile.id},participant_two.eq.${profile.id}`);

      if (!convos || convos.length === 0) return 0;

      const convoIds = convos.map((c) => c.id);

      // Count unread messages not sent by this user
      const { count: unread } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .in("conversation_id", convoIds)
        .eq("is_read", false)
        .neq("sender_profile_id", profile.id);

      return unread || 0;
    },
    enabled: !!profile,
    refetchInterval: 15000, // Poll every 15s
  });

  // Realtime subscription for new messages
  useEffect(() => {
    if (!profile) return;
    const channel = supabase
      .channel("unread-messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["unreadMessages", profile.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, queryClient]);

  return { count };
}
