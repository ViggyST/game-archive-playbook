
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import LogGame from "./pages/LogGame";
import TrackGames from "./pages/TrackGames";
import NotFound from "./pages/NotFound";
import { usePlayerContext } from "./context/PlayerContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { player } = usePlayerContext();

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page route */}
        <Route path="/landing" element={<Landing />} />
        
        {/* Protected routes - redirect to landing if no active player */}
        <Route 
          path="/" 
          element={player ? <Index /> : <Navigate to="/landing" replace />} 
        />
        <Route 
          path="/log-game" 
          element={player ? <LogGame /> : <Navigate to="/landing" replace />} 
        />
        <Route 
          path="/track-games" 
          element={player ? <TrackGames /> : <Navigate to="/landing" replace />} 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PlayerProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </PlayerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
