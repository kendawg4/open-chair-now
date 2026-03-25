import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import ProWaitlist from "./pages/waitlist/ProWaitlist";
import ClientWaitlist from "./pages/waitlist/ClientWaitlist";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Contact from "./pages/legal/Contact";
import HelpCenter from "./pages/legal/HelpCenter";
import CommunityGuidelines from "./pages/legal/CommunityGuidelines";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import RoleSelect from "./pages/onboarding/RoleSelect";
import ProUpgrade from "./pages/onboarding/ProUpgrade";
import ClientOnboarding from "./pages/onboarding/ClientOnboarding";
import ProOnboarding from "./pages/onboarding/ProOnboarding";
import ClientHome from "./pages/client/Home";
import Discover from "./pages/client/Discover";
import Search from "./pages/client/Search";
import Favorites from "./pages/client/Favorites";
import ClientProfile from "./pages/client/Profile";
import ClientProfileEdit from "./pages/client/ProfileEdit";
import ProProfile from "./pages/client/ProProfile";
import ClientBookings from "./pages/client/Bookings";
import ProDashboard from "./pages/pro/Dashboard";
import ProProfileEdit from "./pages/pro/ProfileEdit";
import ProBookings from "./pages/pro/Bookings";
import ProServices from "./pages/pro/Services";
import ProPortfolio from "./pages/pro/Portfolio";
import ProPreview from "./pages/pro/Preview";
import ProProfileSelf from "./pages/pro/ProfileSelf";
import FollowersPage from "./pages/pro/Followers";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin/Dashboard";
import Inbox from "./pages/messages/Inbox";
import ConversationPage from "./pages/messages/Conversation";
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
            <Route path="/waitlist/pro" element={<ProWaitlist />} />
            <Route path="/waitlist/client" element={<ClientWaitlist />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />

            {/* Onboarding */}
            <Route path="/onboarding/role" element={<RoleSelect />} />
            <Route path="/onboarding/client" element={<ClientOnboarding />} />
            <Route path="/onboarding/pro" element={<ProOnboarding />} />
            <Route path="/upgrade-to-pro" element={<ProtectedRoute allowedRoles={["client"]}><ProUpgrade /></ProtectedRoute>} />

            {/* Client */}
            <Route path="/home" element={<ProtectedRoute allowedRoles={["client"]}><ClientHome /></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute allowedRoles={["client"]}><Discover /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute allowedRoles={["client"]}><Search /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute allowedRoles={["client"]}><Favorites /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={["client"]}><ClientProfile /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><ClientProfileEdit /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute allowedRoles={["client"]}><ClientBookings /></ProtectedRoute>} />
            <Route path="/pro/:id" element={<ProtectedRoute><ProProfile /></ProtectedRoute>} />

            {/* Professional */}
            <Route path="/pro/dashboard" element={<ProtectedRoute allowedRoles={["professional", "shop_owner"]}><ProDashboard /></ProtectedRoute>} />
            <Route path="/pro/profile-edit" element={<ProtectedRoute allowedRoles={["professional", "shop_owner"]}><ProProfileEdit /></ProtectedRoute>} />
            <Route path="/pro/bookings" element={<ProtectedRoute allowedRoles={["professional", "shop_owner"]}><ProBookings /></ProtectedRoute>} />
            <Route path="/pro/services" element={<ProtectedRoute allowedRoles={["professional", "shop_owner"]}><ProServices /></ProtectedRoute>} />
            <Route path="/pro/portfolio" element={<ProtectedRoute allowedRoles={["professional", "shop_owner"]}><ProPortfolio /></ProtectedRoute>} />
            <Route path="/pro/preview" element={<ProtectedRoute allowedRoles={["professional", "shop_owner"]}><ProPreview /></ProtectedRoute>} />
            <Route path="/pro/my-profile" element={<ProtectedRoute allowedRoles={["professional", "shop_owner"]}><ProProfileSelf /></ProtectedRoute>} />
            <Route path="/pro/followers/:id" element={<ProtectedRoute><FollowersPage /></ProtectedRoute>} />

            {/* Shared */}
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
            <Route path="/messages/:id" element={<ProtectedRoute><ConversationPage /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
