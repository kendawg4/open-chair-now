import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useStartConversation() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherProfileId: string) => {
      if (!profile) throw new Error("Not logged in");

      // Check if conversation already exists (either direction)
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .or(
          `and(participant_one.eq.${profile.id},participant_two.eq.${otherProfileId}),and(participant_one.eq.${otherProfileId},participant_two.eq.${profile.id})`
        )
        .maybeSingle();

      if (existing) return existing.id;

      // Create new conversation
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
  // Simple hook — could be enhanced with realtime
  return { count: 0 }; // Placeholder, inbox shows unread indicators
}
