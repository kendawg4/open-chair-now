import { BottomNav } from "@/components/BottomNav";
import { useMyProProfile } from "@/hooks/use-data";
import { ArrowLeft, Scissors } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProServices() {
  const { data: proProfile, isLoading } = useMyProProfile();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/pro/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-lg">Services</h1>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : !proProfile?.services?.length ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <Scissors className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-display font-semibold text-sm">No services added yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Add your service menu next so clients can book the right offering.</p>
          </div>
        ) : (
          proProfile.services.map((service: any) => (
            <div key={service.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">{service.service_name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{service.duration_minutes} min</p>
                  {service.description && <p className="mt-2 text-xs text-muted-foreground">{service.description}</p>}
                </div>
                <p className="font-display font-bold text-sm">${Number(service.price)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav role="pro" />
    </div>
  );
}