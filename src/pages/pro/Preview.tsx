import { useAuth } from "@/lib/auth-context";
import { Navigate } from "react-router-dom";

export default function ProPreview() {
  const { proProfileId } = useAuth();

  if (!proProfileId) {
    return <Navigate to="/pro/dashboard" replace />;
  }

  return <Navigate to={`/pro/${proProfileId}`} replace />;
}