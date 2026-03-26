import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

type AppRole = "client" | "professional" | "shop_owner" | "admin";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: AppRole | null;
  roles: AppRole[];
  isPro: boolean;
  isClient: boolean;
  proProfileId: string | null;
  loading: boolean;
  rolesLoaded: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  role: null,
  roles: [],
  isPro: false,
  isClient: false,
  proProfileId: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [proProfileId, setProProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolesLoaded, setRolesLoaded] = useState(false);

  // Primary role: prefer professional > shop_owner > admin > client
  const role: AppRole | null = roles.includes("professional") || roles.includes("shop_owner")
    ? roles.includes("professional") ? "professional" : "shop_owner"
    : roles.includes("admin") ? "admin"
    : roles.includes("client") ? "client"
    : null;

  const isPro = roles.includes("professional") || roles.includes("shop_owner");
  const isClient = roles.includes("client");

  const fetchProfileAndRole = async (userId: string) => {
    setRolesLoaded(false);
    const [profileRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).single(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data as Profile);
      const proRes = await supabase
        .from("professional_profiles")
        .select("id")
        .eq("profile_id", profileRes.data.id)
        .limit(1)
        .maybeSingle();
      setProProfileId(proRes.data?.id || null);
    }
    if (rolesRes.data && rolesRes.data.length > 0) {
      setRoles(rolesRes.data.map(r => r.role as AppRole));
    } else {
      setRoles([]);
    }
    setRolesLoaded(true);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfileAndRole(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Handle email verification redirect
        if (_event === "SIGNED_IN" && window.location.hash.includes("type=signup")) {
          // User just verified their email — redirect to login with success message
          await supabase.auth.signOut();
          window.location.href = "/login?verified=true";
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Don't set loading false until roles are fetched
          fetchProfileAndRole(session.user.id).then(() => setLoading(false));
        } else {
          setProfile(null);
          setRoles([]);
          setProProfileId(null);
          setRolesLoaded(true);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfileAndRole(session.user.id);
      } else {
        setRolesLoaded(true);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setRoles([]);
    setProProfileId(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, role, roles, isPro, isClient, proProfileId, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
