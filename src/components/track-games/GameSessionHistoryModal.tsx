
import { Crown, MapPin, Clock, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useGameSessionHistory } from "@/hooks/useGameSessionHistory";
import { EditSessionModal } from "./EditSessionModal";

interface GameSessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string | null;
  gameName: string;
}

const GameSessionHistoryModal = ({ 
  isOpen, 
  onClose, 
  gameId, 
  gameName 
}: GameSessionHistoryModalProps) => {
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<any>(null);

  useEffect(() => {
    const playerId = localStorage.getItem('active_player');
    setActivePlayerId(playerId);
  }, []);
  
  const { data: myGamesSessions = [], isLoading: isLoadingMyGames, error: myGamesError, refetch: refetchMyGames } = useGameSessionHistory(gameId, activePlayerId);
  const { data: allGamesSessions = [], isLoading: isLoadingAllGames, error: allGamesError, refetch: refetchAllGames } = useGameSessionHistory(gameId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleEditSession = (session: any) => {
    // Transform session data for EditSessionModal - match CalendarView structure
    const sessionData = {
      session_id: session.session_id,
      game_name: session.game_name || gameName, // Use session game name if available, fallback to modal game name
      date: session.date,
      location: session.location,
      duration_minutes: session.duration_minutes,
      highlights: session.highlights || "",
      players: session.players.map((player: any) => ({
        player_id: player.player_id,     // Use real player_id from database
        score_id: player.score_id,       // Use real score_id from database  
        player_name: player.name,        // Use consistent field name from updated hook
        score: player.score,
        is_winner: player.is_winner
      })),
      deleted_at: null
    };
    setEditingSession(sessionData);
  };

  const handleSessionUpdated = () => {
    refetchMyGames();
    refetchAllGames();
    setEditingSession(null);
  };

  const renderSessions = (sessions: any[], isLoading: boolean, error: any) => {
    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading session history</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
              <div className="bg-gray-200 h-4 w-20 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 w-32 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 h-3 w-24 rounded"></div>
                <div className="bg-gray-200 h-3 w-20 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (sessions.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎮</div>
          <p className="text-gray-600">No sessions found</p>
          <p className="text-gray-500 text-sm">This game hasn't been played yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.session_id}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
          >
            {/* Session Info Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">
                {formatDate(session.date)}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{session.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{session.duration_minutes}m</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSession(session)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Players & Scores */}
            <div className="space-y-2 mb-3">
              {session.players.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex items-center gap-2">
                    {player.is_winner && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className={`text-sm ${player.is_winner ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {player.name}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${player.is_winner ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {player.score}
                  </span>
                </div>
              ))}
            </div>

            {/* Highlights */}
            {session.highlights && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 italic">
                  "{session.highlights}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Session History – {gameName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="my-games" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="my-games">My Games</TabsTrigger>
            <TabsTrigger value="all-games">All Games</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-games" className="flex-1 overflow-y-auto mt-0">
            {renderSessions(myGamesSessions, isLoadingMyGames, myGamesError)}
          </TabsContent>
          
          <TabsContent value="all-games" className="flex-1 overflow-y-auto mt-0">
            {renderSessions(allGamesSessions, isLoadingAllGames, allGamesError)}
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Edit Session Modal */}
      {editingSession && (
        <EditSessionModal
          isOpen={!!editingSession}
          onClose={() => setEditingSession(null)}
          sessionData={editingSession}
          onSessionUpdated={handleSessionUpdated}
        />
      )}
    </Dialog>
  );
};

export default GameSessionHistoryModal;
