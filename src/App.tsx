import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DesignBriefProvider } from '@/context/DesignBriefContext';
import DesignBriefPage from '@/pages/Index'; // Assuming Index.tsx is the main design brief page
import { Toaster } from '@/components/ui/toaster'; // Keep ShadCN Toaster
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/ThemeProvider'; // Keep for now
import NotFound from '@/pages/NotFound'; // Keep for unmatched routes

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
              {/* Main route for creating a new design brief */}
              <Route path="/design-brief" element={<BriefWrapper />} />
              {/* Route for loading an existing brief by ID */}
              <Route path="/design-brief/:briefId" element={<BriefWrapper />} />
              {/* Redirect root path to the design brief form */}
              <Route path="/" element={<Navigate to="/design-brief" replace />} />
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
