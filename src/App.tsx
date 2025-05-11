import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link, Outlet } from 'react-router-dom';
import { DesignBriefProvider } from '@/context/DesignBriefContext';
import DesignBriefPage from '@/pages/Index'; // Assuming Index.tsx is the main design brief page
import { Toaster } from '@/components/ui/toaster'; // Keep ShadCN Toaster
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/ThemeProvider'; // Keep for now
import NotFound from '@/pages/NotFound'; // Keep for unmatched routes
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { StableAuthProvider, useStableAuth } from '@/hooks/useStableAuth';
import CreateBriefPage from '@/pages/CreateBriefPage'; // Import the new page
import DashboardPage from '@/pages/DashboardPage'; // Import the real DashboardPage
import { Header } from '@/components/layout/Header'; // Import Header
import ConvaiWidget from '@/components/ConvaiWidget'; // Ensure it is imported for ProtectedLayout

// Remove DashboardPagePlaceholder as it's replaced by the actual DashboardPage
// const DashboardPagePlaceholder = () => (
//   <div className="p-4">
//     <h1 className="text-2xl">Dashboard</h1>
//     <p>Welcome to your dashboard!</p>
//     <Link to="/create-brief" className="text-blue-500 hover:underline">Create New Brief</Link>
//   </div>
// );

// Wrapper component to provide the brief ID to DesignBriefProvider
const BriefWrapper = () => {
  const { briefId } = useParams(); // Get param from react-router
  const { user, session, isLoading: authLoading } = useStableAuth(); // Use useStableAuth
  const [showingLoadingIndicator, setShowingLoadingIndicator] = useState(true);
  
  console.log('[BriefWrapper] Render with briefId:', briefId, 'authLoading:', authLoading, 'user:', user ? 'exists' : 'null', 'session:', session ? 'exists' : 'null');
  
  // Add a safety timeout to prevent infinite loading state
  useEffect(() => {
    // If user and session exist, immediately stop showing loading indicator
    if (user && session) {
      console.log('[BriefWrapper] User and session detected, stopping loading indicator');
      setShowingLoadingIndicator(false);
      return;
    }

    // If not loading, also stop showing indicator
    if (!authLoading) {
      console.log('[BriefWrapper] Auth no longer loading, stopping loading indicator');
      setShowingLoadingIndicator(false);
      return;
    }
    
    // Safety timeout - after 3 seconds stop showing loading indicator regardless
    const timer = setTimeout(() => {
      console.log('[BriefWrapper] Loading timeout reached, stopping loading indicator');
      setShowingLoadingIndicator(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [authLoading, user, session]);
  
  // Only show loading state while initializing
  if (showingLoadingIndicator && authLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <div className="text-center">
          <div className="mb-2">Checking authentication...</div>
          <div className="text-sm text-gray-500">This should only take a moment</div>
        </div>
      </div>
    );
  }
  
  // If we're here, we're either authenticated or the timeout kicked in
  return (
    <DesignBriefProvider briefId={briefId}>
      <DesignBriefPage />
    </DesignBriefProvider>
  );
};

// Layout for Protected Routes
const ProtectedLayout = () => (
  <div className="min-h-screen flex flex-col bg-muted/40">
    <Header />
    <main className="flex-grow">
      <Outlet /> {/* Nested routes will render here */}
    </main>
    <ConvaiWidget /> {/* Add ConvaiWidget to the protected layout */}
    {/* You can add a common footer here if needed */}
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <StableAuthProvider>
          <Router>
            <div className="w-full max-w-[100vw] overflow-x-hidden">
              <Toaster /> 
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes with Header */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<ProtectedLayout />}> {/* Wrap protected routes with the new layout */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/create-brief" element={<CreateBriefPage />} />
                    <Route path="/design-brief" element={<BriefWrapper />} />
                    <Route path="/design-brief/:briefId" element={<BriefWrapper />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Route>
                </Route>

                {/* Catch-all for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </StableAuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
