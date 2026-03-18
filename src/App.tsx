import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import RoleSelect from "./pages/onboarding/RoleSelect";
import ClientOnboarding from "./pages/onboarding/ClientOnboarding";
import ProOnboarding from "./pages/onboarding/ProOnboarding";
import ClientHome from "./pages/client/Home";
import Discover from "./pages/client/Discover";
import Search from "./pages/client/Search";
import Favorites from "./pages/client/Favorites";
import ClientProfile from "./pages/client/Profile";
import ProProfile from "./pages/client/ProProfile";
import ProDashboard from "./pages/pro/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Onboarding */}
            <Route path="/onboarding/role" element={<RoleSelect />} />
            <Route path="/onboarding/client" element={<ClientOnboarding />} />
            <Route path="/onboarding/pro" element={<ProOnboarding />} />

            {/* Client */}
            <Route path="/home" element={<ProtectedRoute><ClientHome /></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
            <Route path="/pro/:id" element={<ProtectedRoute><ProProfile /></ProtectedRoute>} />

            {/* Professional */}
            <Route path="/pro/dashboard" element={<ProtectedRoute allowedRoles={["professional", "shop_owner"]}><ProDashboard /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
