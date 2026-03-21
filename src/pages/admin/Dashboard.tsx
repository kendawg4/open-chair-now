import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Scissors, Calendar, ClipboardList, Ban, Eye, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Stats {
  users: number;
  professionals: number;
  bookings: number;
  proWaitlist: number;
  clientWaitlist: number;
}

export default function AdminDashboard() {
  const { role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [proWaitlist, setProWaitlist] = useState<any[]>([]);
  const [clientWaitlist, setClientWaitlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === "admin") fetchAll();
  }, [role]);

  async function fetchAll() {
    setLoading(true);
    const [profilesRes, prosRes, bookingsRes, proWlRes, clientWlRes] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, city, state, created_at, user_id"),
      supabase.from("professional_profiles").select("id, profile_id, category, business_name, city, state, status, is_suspended, is_verified, average_rating, total_reviews, created_at, profiles!professional_profiles_profile_id_fkey(full_name, email)"),
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase.from("pro_waitlist").select("*").order("created_at", { ascending: false }),
      supabase.from("client_waitlist").select("*").order("created_at", { ascending: false }),
    ]);

    const allProfiles = profilesRes.data || [];

    // Get pro user_ids to separate clients
    const proProfileIds = new Set((prosRes.data || []).map((p: any) => p.profile_id));
    const clientList = allProfiles.filter(p => !proProfileIds.has(p.id));

    setStats({
      users: allProfiles.length,
      professionals: (prosRes.data || []).length,
      bookings: bookingsRes.count || 0,
      proWaitlist: (proWlRes.data || []).length,
      clientWaitlist: (clientWlRes.data || []).length,
    });
    setProfessionals(prosRes.data || []);
    setClients(clientList);
    setProWaitlist(proWlRes.data || []);
    setClientWaitlist(clientWlRes.data || []);
    setLoading(false);
  }

  async function toggleSuspend(proId: string, currentlySuspended: boolean) {
    const { error } = await supabase
      .from("professional_profiles")
      .update({ is_suspended: !currentlySuspended })
      .eq("id", proId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: currentlySuspended ? "Professional restored" : "Professional suspended" });
      fetchAll();
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  if (role !== "admin") return <Navigate to="/" replace />;

  const fmt = (d: string) => new Date(d).toLocaleDateString();
  const categoryLabel = (c: string) => c?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
      </div>

      <div className="p-4 space-y-6 pb-8 max-w-3xl mx-auto">
        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={<Users className="h-5 w-5" />} label="Total Users" value={stats.users} />
            <StatCard icon={<Scissors className="h-5 w-5" />} label="Professionals" value={stats.professionals} />
            <StatCard icon={<Calendar className="h-5 w-5" />} label="Bookings" value={stats.bookings} />
            <StatCard icon={<ClipboardList className="h-5 w-5" />} label="Waitlist" value={stats.proWaitlist + stats.clientWaitlist} />
          </div>
        )}

        {/* Tables */}
        <Tabs defaultValue="professionals">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="professionals" className="text-xs">Pros</TabsTrigger>
            <TabsTrigger value="clients" className="text-xs">Clients</TabsTrigger>
            <TabsTrigger value="pro-wl" className="text-xs">Pro WL</TabsTrigger>
            <TabsTrigger value="client-wl" className="text-xs">Client WL</TabsTrigger>
          </TabsList>

          <TabsContent value="professionals" className="space-y-2 mt-3">
            {loading ? <LoadingSkeleton /> : professionals.length === 0 ? (
              <EmptyState text="No professionals yet" />
            ) : professionals.map((pro: any) => (
              <Card key={pro.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{(pro.profiles as any)?.full_name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{categoryLabel(pro.category)} · {pro.city || "No city"}, {pro.state || ""}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <Badge variant={pro.is_suspended ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0">
                        {pro.is_suspended ? "Suspended" : pro.status?.replace(/-/g, " ")}
                      </Badge>
                      {pro.is_verified && <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-0">Verified</Badge>}
                      <span className="text-[10px] text-muted-foreground">★ {Number(pro.average_rating || 0).toFixed(1)} ({pro.total_reviews})</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Joined {fmt(pro.created_at)}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="ghost" className="h-7 text-xs px-2" onClick={() => navigate(`/pro/${pro.id}`)}>
                      <Eye className="h-3 w-3 mr-1" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant={pro.is_suspended ? "outline" : "destructive"}
                      className="h-7 text-xs px-2"
                      onClick={() => toggleSuspend(pro.id, pro.is_suspended)}
                    >
                      <Ban className="h-3 w-3 mr-1" /> {pro.is_suspended ? "Restore" : "Suspend"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="clients" className="space-y-2 mt-3">
            {loading ? <LoadingSkeleton /> : clients.length === 0 ? (
              <EmptyState text="No clients yet" />
            ) : clients.map((c: any) => (
              <Card key={c.id} className="p-3">
                <p className="font-medium text-sm">{c.full_name || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">{c.email}</p>
                <p className="text-xs text-muted-foreground">{c.city || "No city"}, {c.state || ""} · Joined {fmt(c.created_at)}</p>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pro-wl" className="space-y-2 mt-3">
            {loading ? <LoadingSkeleton /> : proWaitlist.length === 0 ? (
              <EmptyState text="No pro waitlist entries" />
            ) : proWaitlist.map((w: any) => (
              <Card key={w.id} className="p-3">
                <p className="font-medium text-sm">{w.full_name}</p>
                <p className="text-xs text-muted-foreground">{w.email} · {w.phone}</p>
                <p className="text-xs text-muted-foreground">{categoryLabel(w.category)} · {w.city}, {w.state}</p>
                {w.business_name && <p className="text-xs text-muted-foreground">{w.business_name}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">{fmt(w.created_at)}</p>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="client-wl" className="space-y-2 mt-3">
            {loading ? <LoadingSkeleton /> : clientWaitlist.length === 0 ? (
              <EmptyState text="No client waitlist entries" />
            ) : clientWaitlist.map((w: any) => (
              <Card key={w.id} className="p-3">
                <p className="font-medium text-sm">{w.full_name}</p>
                <p className="text-xs text-muted-foreground">{w.email} · {w.city}, {w.state}</p>
                {w.services_interested && <p className="text-xs text-muted-foreground">Interested in: {w.services_interested}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">{fmt(w.created_at)}</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return <>{[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}</>;
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground text-center py-8">{text}</p>;
}
