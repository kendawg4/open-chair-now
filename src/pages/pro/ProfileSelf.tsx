import { useAuth } from "@/lib/auth-context";
import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProProfileSelf() {
  const { proProfileId, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-20 w-20 rounded-2xl" />
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  if (!proProfileId) {
    return <Navigate to="/pro/dashboard" replace />;
  }

  return <Navigate to={`/pro/${proProfileId}`} replace />;
}
