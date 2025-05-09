import React from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DesignBriefProvider } from '@/context/DesignBriefContext';
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import TestSupabasePage from "./pages/TestSupabasePage";
import TestDashboardSchemePage from "./pages/TestDashboardSchemePage";
import { Login, Register, ForgotPassword, ResetPassword, ProtectedRoute, RedirectIfAuthenticated } from "@/components/auth";
import { DashboardRouter } from "@/components/dashboard";
import { DiagnosticsPage } from '@/components/dashboard/pages/DiagnosticsPage';

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
              <Sonner />
              <Routes>
                {/* Public Routes */}
                <Route element={<RedirectIfAuthenticated />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                </Route>
                <Route path="/about" element={<About />} />
                <Route path="/test-supabase-public" element={<TestSupabasePage />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/design-brief" element={<Index />} />
                  <Route path="/design-brief/:projectId" element={<Index />} />
                  <Route path="/test-supabase" element={<TestSupabasePage />} />
                  <Route path="/test-dashboard-schema" element={<TestDashboardSchemePage />} />
                  
                  {/* Dashboard Routes */}
                  <Route path="/dashboard/*" element={<DashboardRouter />} />
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
