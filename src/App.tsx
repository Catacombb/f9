import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DesignBriefProvider } from '@/context/DesignBriefContext';
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import TestSupabasePage from "./pages/TestSupabasePage";
import { Login, Register, ForgotPassword, ResetPassword, ProtectedRoute } from "@/components/auth";

const App = () => {
  // Create a client instance inside the component to ensure proper React lifecycle
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    // Move BrowserRouter to the top level so all components have access to routing features
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <DesignBriefProvider>
          <TooltipProvider delayDuration={300}>
            <div className="w-full max-w-[100vw] overflow-x-hidden">
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/test-supabase-public" element={<TestSupabasePage />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/test-supabase" element={<TestSupabasePage />} />
                  {/* Add more protected routes here */}
                </Route>
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </TooltipProvider>
        </DesignBriefProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
