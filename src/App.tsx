
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import Categories from "./pages/Categories";
import EventsPage from "./pages/events";
import About from "./pages/About";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import VendorDashboard from "./pages/vendor/Dashboard";
import ProductPage from "./pages/ProductPage";
import Payment from "./pages/Payment";
import AdminPanel from "./pages/admin";
import ChatPage from "./pages/chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendors/:id" element={<ProductPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
