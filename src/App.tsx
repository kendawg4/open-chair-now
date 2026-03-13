import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
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
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<ClientHome />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/pro/:id" element={<ProProfile />} />
          <Route path="/pro/dashboard" element={<ProDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
