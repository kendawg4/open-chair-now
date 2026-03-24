export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string
          id: string
          notes: string | null
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string
          id?: string
          notes?: string | null
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      availability_status_history: {
        Row: {
          created_at: string
          discount_percent: number | null
          ends_at: string | null
          id: string
          note: string | null
          professional_profile_id: string
          promo_text: string | null
          starts_at: string | null
          status: Database["public"]["Enums"]["availability_status"]
        }
        Insert: {
          created_at?: string
          discount_percent?: number | null
          ends_at?: string | null
          id?: string
          note?: string | null
          professional_profile_id: string
          promo_text?: string | null
          starts_at?: string | null
          status: Database["public"]["Enums"]["availability_status"]
        }
        Update: {
          created_at?: string
          discount_percent?: number | null
          ends_at?: string | null
          id?: string
          note?: string | null
          professional_profile_id?: string
          promo_text?: string | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["availability_status"]
        }
        Relationships: [
          {
            foreignKeyName: "availability_status_history_professional_profile_id_fkey"
            columns: ["professional_profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          client_profile_id: string
          created_at: string
          end_time: string | null
          id: string
          notes: string | null
          professional_profile_id: string
          service_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price_estimate: number | null
          updated_at: string
        }
        Insert: {
          booking_date: string
          client_profile_id: string
          created_at?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          professional_profile_id: string
          service_id?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price_estimate?: number | null
          updated_at?: string
        }
        Update: {
          booking_date?: string
          client_profile_id?: string
          created_at?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          professional_profile_id?: string
          service_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price_estimate?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_profile_id_fkey"
            columns: ["client_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_professional_profile_id_fkey"
            columns: ["professional_profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      client_waitlist: {
        Row: {
          city: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          referral_source: string | null
          services_interested: string | null
          state: string
          wants_realtime_availability: boolean | null
        }
        Insert: {
          city: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          referral_source?: string | null
          services_interested?: string | null
          state: string
          wants_realtime_availability?: boolean | null
        }
        Update: {
          city?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          referral_source?: string | null
          services_interested?: string | null
          state?: string
          wants_realtime_availability?: boolean | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          profile_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          profile_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          client_profile_id: string
          created_at: string
          id: string
          professional_profile_id: string
        }
        Insert: {
          client_profile_id: string
          created_at?: string
          id?: string
          professional_profile_id: string
        }
        Update: {
          client_profile_id?: string
          created_at?: string
          id?: string
          professional_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_client_profile_id_fkey"
            columns: ["client_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_professional_profile_id_fkey"
            columns: ["professional_profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          client_profile_id: string
          created_at: string
          id: string
          professional_profile_id: string
        }
        Insert: {
          client_profile_id: string
          created_at?: string
          id?: string
          professional_profile_id: string
        }
        Update: {
          client_profile_id?: string
          created_at?: string
          id?: string
          professional_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_client_profile_id_fkey"
            columns: ["client_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_professional_profile_id_fkey"
            columns: ["professional_profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean | null
          related_entity_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          related_entity_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          related_entity_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          media_type: string | null
          media_url: string
          professional_profile_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          media_type?: string | null
          media_url: string
          professional_profile_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          media_type?: string | null
          media_url?: string
          professional_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_professional_profile_id_fkey"
            columns: ["professional_profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comment_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number | null
          post_type: Database["public"]["Enums"]["post_type"]
          professional_profile_id: string
          repost_count: number | null
        }
        Insert: {
          comment_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          post_type?: Database["public"]["Enums"]["post_type"]
          professional_profile_id: string
          repost_count?: number | null
        }
        Update: {
          comment_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          post_type?: Database["public"]["Enums"]["post_type"]
          professional_profile_id?: string
          repost_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_professional_profile_id_fkey"
            columns: ["professional_profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pro_waitlist: {
        Row: {
          accepts_walk_ins: boolean | null
          additional_notes: string | null
          business_name: string | null
          category: string
          city: string
          created_at: string
          email: string
          full_name: string
          id: string
          instagram: string | null
          phone: string
          specialties: string | null
          state: string
          wants_open_chair_alerts: boolean | null
        }
        Insert: {
          accepts_walk_ins?: boolean | null
          additional_notes?: string | null
          business_name?: string | null
          category: string
          city: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          instagram?: string | null
          phone: string
          specialties?: string | null
          state: string
          wants_open_chair_alerts?: boolean | null
        }
        Update: {
          accepts_walk_ins?: boolean | null
          additional_notes?: string | null
          business_name?: string | null
          category?: string
          city?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          instagram?: string | null
          phone?: string
          specialties?: string | null
          state?: string
          wants_open_chair_alerts?: boolean | null
        }
        Relationships: []
      }
      professional_profiles: {
        Row: {
          accepts_walk_ins: boolean | null
          address: string | null
          average_rating: number | null
          business_name: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          category: Database["public"]["Enums"]["professional_category"]
          city: string | null
          created_at: string
          follower_count: number | null
          id: string
          instagram_url: string | null
          is_mobile_service: boolean | null
          is_suspended: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          latitude: number | null
          longitude: number | null
          onboarding_completed: boolean | null
          profile_id: string
          service_radius_miles: number | null
          shop_name: string | null
          specialties: string[] | null
          state: string | null
          status: Database["public"]["Enums"]["availability_status"]
          status_expires_at: string | null
          status_note: string | null
          status_promo: string | null
          tiktok_url: string | null
          total_reviews: number | null
          updated_at: string
          website_url: string | null
          years_experience: number | null
          zip_code: string | null
        }
        Insert: {
          accepts_walk_ins?: boolean | null
          address?: string | null
          average_rating?: number | null
          business_name?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          category?: Database["public"]["Enums"]["professional_category"]
          city?: string | null
          created_at?: string
          follower_count?: number | null
          id?: string
          instagram_url?: string | null
          is_mobile_service?: boolean | null
          is_suspended?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          latitude?: number | null
          longitude?: number | null
          onboarding_completed?: boolean | null
          profile_id: string
          service_radius_miles?: number | null
          shop_name?: string | null
          specialties?: string[] | null
          state?: string | null
          status?: Database["public"]["Enums"]["availability_status"]
          status_expires_at?: string | null
          status_note?: string | null
          status_promo?: string | null
          tiktok_url?: string | null
          total_reviews?: number | null
          updated_at?: string
          website_url?: string | null
          years_experience?: number | null
          zip_code?: string | null
        }
        Update: {
          accepts_walk_ins?: boolean | null
          address?: string | null
          average_rating?: number | null
          business_name?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          category?: Database["public"]["Enums"]["professional_category"]
          city?: string | null
          created_at?: string
          follower_count?: number | null
          id?: string
          instagram_url?: string | null
          is_mobile_service?: boolean | null
          is_suspended?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          latitude?: number | null
          longitude?: number | null
          onboarding_completed?: boolean | null
          profile_id?: string
          service_radius_miles?: number | null
          shop_name?: string | null
          specialties?: string[] | null
          state?: string | null
          status?: Database["public"]["Enums"]["availability_status"]
          status_expires_at?: string | null
          status_note?: string | null
          status_promo?: string | null
          tiktok_url?: string | null
          total_reviews?: number | null
          updated_at?: string
          website_url?: string | null
          years_experience?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          display_name: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          state: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          reason: string
          reported_profile_id: string
          reporter_profile_id: string
          status: Database["public"]["Enums"]["report_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          reason: string
          reported_profile_id: string
          reporter_profile_id: string
          status?: Database["public"]["Enums"]["report_status"]
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          reason?: string
          reported_profile_id?: string
          reporter_profile_id?: string
          status?: Database["public"]["Enums"]["report_status"]
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_profile_id_fkey"
            columns: ["reported_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_profile_id_fkey"
            columns: ["reporter_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reposts: {
        Row: {
          created_at: string
          id: string
          post_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reposts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reposts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string
          client_profile_id: string
          created_at: string
          id: string
          professional_profile_id: string
          rating: number
          review_text: string | null
          tags: string[] | null
        }
        Insert: {
          booking_id: string
          client_profile_id: string
          created_at?: string
          id?: string
          professional_profile_id: string
          rating: number
          review_text?: string | null
          tags?: string[] | null
        }
        Update: {
          booking_id?: string
          client_profile_id?: string
          created_at?: string
          id?: string
          professional_profile_id?: string
          rating?: number
          review_text?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_client_profile_id_fkey"
            columns: ["client_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_professional_profile_id_fkey"
            columns: ["professional_profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          instant_book: boolean | null
          is_active: boolean | null
          price: number
          professional_profile_id: string
          service_name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          instant_book?: boolean | null
          is_active?: boolean | null
          price?: number
          professional_profile_id: string
          service_name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          instant_book?: boolean | null
          is_active?: boolean | null
          price?: number
          professional_profile_id?: string
          service_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_professional_profile_id_fkey"
            columns: ["professional_profile_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_pro_profile_id: { Args: never; Returns: string }
      get_my_profile_id: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "client" | "professional" | "shop_owner" | "admin"
      availability_status:
        | "open-chair"
        | "available-now"
        | "last-minute"
        | "appointment-only"
        | "busy"
        | "offline"
      booking_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
        | "declined"
      business_type:
        | "independent"
        | "booth-renter"
        | "shop-employee"
        | "shop-owner"
      post_type: "portfolio" | "promotion" | "opening" | "update"
      professional_category:
        | "barber"
        | "hairstylist"
        | "braider"
        | "loc-specialist"
        | "nail-tech"
        | "esthetician"
        | "lash-tech"
        | "makeup-artist"
        | "tattoo-artist"
        | "piercer"
      report_status: "pending" | "reviewed" | "resolved" | "dismissed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["client", "professional", "shop_owner", "admin"],
      availability_status: [
        "open-chair",
        "available-now",
        "last-minute",
        "appointment-only",
        "busy",
        "offline",
      ],
      booking_status: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
        "declined",
      ],
      business_type: [
        "independent",
        "booth-renter",
        "shop-employee",
        "shop-owner",
      ],
      post_type: ["portfolio", "promotion", "opening", "update"],
      professional_category: [
        "barber",
        "hairstylist",
        "braider",
        "loc-specialist",
        "nail-tech",
        "esthetician",
        "lash-tech",
        "makeup-artist",
        "tattoo-artist",
        "piercer",
      ],
      report_status: ["pending", "reviewed", "resolved", "dismissed"],
    },
  },
} as const
