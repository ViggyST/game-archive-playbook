
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import LogGame from "./pages/LogGame";
import TrackGames from "./pages/TrackGames";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [hasActivePlayer, setHasActivePlayer] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if there's an active player stored
    const activePlayer = localStorage.getItem('active_player');
    setHasActivePlayer(!!activePlayer);
  }, []);

  if (hasActivePlayer === null) {
    // Loading state while checking for active player
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing page route */}
            <Route path="/landing" element={<Landing />} />
            
            {/* Protected routes - redirect to landing if no active player */}
            <Route 
              path="/" 
              element={hasActivePlayer ? <Index /> : <Navigate to="/landing" replace />} 
            />
            <Route 
              path="/log-game" 
              element={hasActivePlayer ? <LogGame /> : <Navigate to="/landing" replace />} 
            />
            <Route 
              path="/track-games" 
              element={hasActivePlayer ? <TrackGames /> : <Navigate to="/landing" replace />} 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
