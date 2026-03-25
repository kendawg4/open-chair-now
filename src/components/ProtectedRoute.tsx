import { useAuth } from "@/lib/auth-context";
import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, roles, role, isPro, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length === 0) {
    return <Navigate to="/onboarding/role" replace />;
  }

  if (allowedRoles) {
    const hasAccess = allowedRoles.some(r => roles.includes(r as any));
    if (!hasAccess) {
      if (isPro) return <Navigate to="/pro/dashboard" replace />;
      if (role === "admin") return <Navigate to="/admin" replace />;
      return <Navigate to="/home" replace />;
    }
  }

  return <>{children}</>;
}
