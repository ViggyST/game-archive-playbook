
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { PlayerProvider } from "@/context/PlayerContext";
import Index from "@/pages/Index";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import TrackGames from "@/pages/TrackGames";
import LogGame from "@/pages/LogGame";
import Collections from "@/pages/Collections";

function App() {
  return (
    <PlayerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/track-games" element={<TrackGames />} />
          <Route path="/log-game" element={<LogGame />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </PlayerProvider>
  );
}

export default App;
