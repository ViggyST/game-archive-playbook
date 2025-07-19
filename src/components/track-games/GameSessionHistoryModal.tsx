
import { Crown, MapPin, Clock, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGameSessionHistory } from "@/hooks/useGameSessionHistory";

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
  // Kirito's player ID
  const kiritoPlayerId = '3db5dc38-1f5d-499f-bece-b1c20e31f838';
  
  const { data: myGamesSessions = [], isLoading: isLoadingMyGames, error: myGamesError } = useGameSessionHistory(gameId, kiritoPlayerId);
  const { data: allGamesSessions = [], isLoading: isLoadingAllGames, error: allGamesError } = useGameSessionHistory(gameId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
                      {player.player_name}
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
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-gray-900">
              Session History – {gameName}
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
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
    </Dialog>
  );
};

export default GameSessionHistoryModal;
