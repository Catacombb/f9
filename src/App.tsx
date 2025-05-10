import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DesignBriefProvider } from '@/context/DesignBriefContext';
import DesignBriefPage from '@/pages/Index'; // Assuming Index.tsx is the main design brief page
import { Toaster } from '@/components/ui/toaster'; // Keep ShadCN Toaster
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/ThemeProvider'; // Keep for now
import NotFound from '@/pages/NotFound'; // Keep for unmatched routes
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Placeholder for DashboardPage - will be created in Phase 3
const DashboardPagePlaceholder = () => (
  <div className="p-4">
    <h1 className="text-2xl">Dashboard</h1>
    <p>Welcome to your dashboard!</p>
    {/* Link to create a new brief - for testing protected route */}
    <a href="/design-brief" className="text-blue-500 hover:underline">Create New Brief</a>
  </div>
);

// Wrapper component to provide the brief ID to DesignBriefProvider
const BriefWrapper = ({ briefId }: { briefId?: string }) => (
  <DesignBriefProvider briefId={briefId}>
    <DesignBriefPage />
  </DesignBriefProvider>
);

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Router>
          <div className="w-full max-w-[100vw] overflow-x-hidden">
            <Toaster /> 
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPagePlaceholder />} />
                <Route path="/design-brief" element={<BriefWrapper />} />
                <Route path="/design-brief/:briefId" element={<BriefWrapper />} />
                {/* Redirect root to dashboard if authenticated, else ProtectedRoute handles redirect to /login */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>

              {/* Catch-all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
