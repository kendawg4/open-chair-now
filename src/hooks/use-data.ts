import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import type { Database } from "@/integrations/supabase/types";

type ProfessionalProfile = Database["public"]["Tables"]["professional_profiles"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type PortfolioItem = Database["public"]["Tables"]["portfolio_items"]["Row"];
type Review = Database["public"]["Tables"]["reviews"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];

// ===== PROFESSIONALS =====
export interface ProWithProfile {
  id: string;
  profile_id: string;
  business_name: string | null;
  category: string;
  business_type: string;
  specialties: string[];
  years_experience: number | null;
  shop_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  instagram_url: string | null;
  is_verified: boolean | null;
  average_rating: number | null;
  total_reviews: number | null;
  follower_count: number | null;
  status: string;
  status_note: string | null;
  status_promo: string | null;
  accepts_walk_ins: boolean | null;
  is_mobile_service: boolean | null;
  languages: string[] | null;
  onboarding_completed: boolean | null;
  // Joined from profiles
  full_name: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  // Joined
  services?: Service[];
  portfolio_items?: PortfolioItem[];
}

export function useProfessionals(filters?: {
  status?: string[];
  category?: string;
  city?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["professionals", filters],
    queryFn: async () => {
      let query = supabase
        .from("professional_profiles")
        .select(`
          *,
          profiles!inner(full_name, display_name, avatar_url, bio),
          services(*),
          portfolio_items(*)
        `)
        .eq("onboarding_completed", true)
        .eq("is_suspended", false);

      if (filters?.status && filters.status.length > 0) {
        query = query.in("status", filters.status as any);
      }
      if (filters?.category) {
        query = query.eq("category", filters.category as any);
      }
      if (filters?.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }

      const { data, error } = await query.order("status", { ascending: true });
      if (error) throw error;

      return (data || []).map((item: any) => ({
        ...item,
        full_name: item.profiles?.full_name || "",
        display_name: item.profiles?.display_name,
        avatar_url: item.profiles?.avatar_url,
        bio: item.profiles?.bio || item.profiles?.full_name,
      })) as ProWithProfile[];
    },
  });
}

export function useProfessionalById(id: string | undefined) {
  return useQuery({
    queryKey: ["professional", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("professional_profiles")
        .select(`
          *,
          profiles!inner(full_name, display_name, avatar_url, bio, email),
          services(*),
          portfolio_items(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return {
        ...data,
        full_name: (data as any).profiles?.full_name || "",
        display_name: (data as any).profiles?.display_name || null,
        avatar_url: (data as any).profiles?.avatar_url || null,
        bio: (data as any).profiles?.bio || null,
      } as unknown as ProWithProfile;
    },
    enabled: !!id,
  });
}

// ===== REALTIME SUBSCRIPTION =====
export function useRealtimeProfessionals() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("pro-status-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "professional_profiles" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["professionals"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

// ===== MY PRO PROFILE =====
export function useMyProProfile() {
  const { proProfileId } = useAuth();

  return useQuery({
    queryKey: ["myProProfile", proProfileId],
    queryFn: async () => {
      if (!proProfileId) return null;
      const { data, error } = await supabase
        .from("professional_profiles")
        .select(`
          *,
          profiles!inner(full_name, display_name, avatar_url, bio),
          services(*),
          portfolio_items(*)
        `)
        .eq("id", proProfileId)
        .single();
      if (error) throw error;
      return {
        ...data,
        full_name: (data as any).profiles?.full_name || "",
        avatar_url: (data as any).profiles?.avatar_url,
      } as ProWithProfile;
    },
    enabled: !!proProfileId,
  });
}

// ===== STATUS UPDATE =====
export function useUpdateStatus() {
  const queryClient = useQueryClient();
  const { proProfileId } = useAuth();

  return useMutation({
    mutationFn: async (args: { status: string; note?: string; promo?: string }) => {
      if (!proProfileId) throw new Error("No pro profile");
      const { error } = await supabase
        .from("professional_profiles")
        .update({
          status: args.status as any,
          status_note: args.note || null,
          status_promo: args.promo || null,
        })
        .eq("id", proProfileId);
      if (error) throw error;

      // Log status history
      await supabase.from("availability_status_history").insert({
        professional_profile_id: proProfileId,
        status: args.status as any,
        note: args.note || null,
        promo_text: args.promo || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProProfile"] });
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

// ===== REVIEWS =====
export function useReviewsForPro(proProfileId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", proProfileId],
    queryFn: async () => {
      if (!proProfileId) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select(`*, profiles:client_profile_id(full_name, avatar_url)`)
        .eq("professional_profile_id", proProfileId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!proProfileId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      booking_id: string;
      client_profile_id: string;
      professional_profile_id: string;
      rating: number;
      review_text?: string;
      tags?: string[];
    }) => {
      const { error } = await supabase.from("reviews").insert(args);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

// ===== BOOKINGS =====
export function useMyBookings(role: "client" | "pro") {
  const { profile, proProfileId } = useAuth();
  return useQuery({
    queryKey: ["bookings", role, profile?.id],
    queryFn: async () => {
      if (role === "client" && profile) {
        const { data, error } = await supabase
          .from("bookings")
          .select(`*, services(service_name, duration_minutes), professional_profiles(*, profiles!inner(full_name, avatar_url))`)
          .eq("client_profile_id", profile.id)
          .order("booking_date", { ascending: false });
        if (error) throw error;
        return data || [];
      } else if (role === "pro" && proProfileId) {
        const { data, error } = await supabase
          .from("bookings")
          .select(`*, services(service_name, duration_minutes), profiles:client_profile_id(full_name, avatar_url)`)
          .eq("professional_profile_id", proProfileId)
          .order("booking_date", { ascending: false });
        if (error) throw error;
        return data || [];
      }
      return [];
    },
    enabled: !!(profile || proProfileId),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      client_profile_id: string;
      professional_profile_id: string;
      service_id: string;
      booking_date: string;
      start_time: string;
      notes?: string;
      total_price_estimate?: number;
    }) => {
      const { error } = await supabase.from("bookings").insert(args);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; status: string }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: args.status as any })
        .eq("id", args.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// ===== FAVORITES =====
export function useMyFavorites() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["favorites", profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select(`*, professional_profiles(*, profiles!inner(full_name, avatar_url, bio), services(*), portfolio_items(*))`)
        .eq("client_profile_id", profile.id);
      if (error) throw error;
      return (data || []).map((fav: any) => ({
        ...fav,
        pro: {
          ...fav.professional_profiles,
          full_name: fav.professional_profiles?.profiles?.full_name || "",
          avatar_url: fav.professional_profiles?.profiles?.avatar_url,
          bio: fav.professional_profiles?.profiles?.bio,
        },
      }));
    },
    enabled: !!profile,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (proProfileId: string) => {
      if (!profile) throw new Error("Not logged in");
      // Check if exists
      const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("client_profile_id", profile.id)
        .eq("professional_profile_id", proProfileId)
        .maybeSingle();

      if (existing) {
        await supabase.from("favorites").delete().eq("id", existing.id);
      } else {
        await supabase.from("favorites").insert({
          client_profile_id: profile.id,
          professional_profile_id: proProfileId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useIsFavorite(proProfileId: string | undefined) {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["isFavorite", profile?.id, proProfileId],
    queryFn: async () => {
      if (!profile || !proProfileId) return false;
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("client_profile_id", profile.id)
        .eq("professional_profile_id", proProfileId)
        .maybeSingle();
      return !!data;
    },
    enabled: !!profile && !!proProfileId,
  });
}

// ===== FOLLOWS =====
export function useToggleFollow() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (proProfileId: string) => {
      if (!profile) throw new Error("Not logged in");
      const { data: existing } = await supabase
        .from("follows")
        .select("id")
        .eq("client_profile_id", profile.id)
        .eq("professional_profile_id", proProfileId)
        .maybeSingle();

      if (existing) {
        await supabase.from("follows").delete().eq("id", existing.id);
      } else {
        await supabase.from("follows").insert({
          client_profile_id: profile.id,
          professional_profile_id: proProfileId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

export function useIsFollowing(proProfileId: string | undefined) {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["isFollowing", profile?.id, proProfileId],
    queryFn: async () => {
      if (!profile || !proProfileId) return false;
      const { data } = await supabase
        .from("follows")
        .select("id")
        .eq("client_profile_id", profile.id)
        .eq("professional_profile_id", proProfileId)
        .maybeSingle();
      return !!data;
    },
    enabled: !!profile && !!proProfileId,
  });
}

// ===== POSTS / FEED =====
export function useFeed() {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`*, professional_profiles(*, profiles!inner(full_name, avatar_url))`)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data || []).map((post: any) => ({
        ...post,
        pro_name: post.professional_profiles?.profiles?.full_name || "",
        pro_avatar: post.professional_profiles?.profiles?.avatar_url,
        pro_category: post.professional_profiles?.category,
        pro_status: post.professional_profiles?.status,
      }));
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      professional_profile_id: string;
      content: string;
      image_url?: string;
      post_type: string;
    }) => {
      const { error } = await supabase.from("posts").insert(args as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

// ===== NOTIFICATIONS =====
export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// ===== SERVICES MANAGEMENT =====
export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      professional_profile_id: string;
      service_name: string;
      price: number;
      duration_minutes: number;
      description?: string;
      instant_book?: boolean;
    }) => {
      const { error } = await supabase.from("services").insert(args);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProProfile"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProProfile"] });
    },
  });
}

// ===== PORTFOLIO MANAGEMENT =====
export function useUploadPortfolioItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (args: { file: File; proProfileId: string; caption?: string }) => {
      if (!user) throw new Error("Not logged in");
      const ext = args.file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(path, args.file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(path);

      const { error } = await supabase.from("portfolio_items").insert({
        professional_profile_id: args.proProfileId,
        media_url: urlData.publicUrl,
        caption: args.caption || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProProfile"] });
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
    },
  });
}

export function useDeletePortfolioItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProProfile"] });
    },
  });
}
