
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Dice6 } from 'lucide-react';
import { GameCatalogItem } from '@/hooks/useGameCatalogSearch';

interface GameSearchDropdownProps {
  games: GameCatalogItem[];
  onSelect: (game: GameCatalogItem) => void;
  isLoading?: boolean;
}

export const GameSearchDropdown = ({ games, onSelect, isLoading }: GameSearchDropdownProps) => {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Searching catalog...</span>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
      {games.map((game) => (
        <div
          key={game.game_id}
          onClick={() => onSelect(game)}
          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
        >
          <div className="flex items-start gap-3">
            {/* Game Thumbnail */}
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {game.thumbnail ? (
                <img 
                  src={game.thumbnail} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`${game.thumbnail ? 'hidden' : ''} text-gray-400`}>
                <Dice6 className="w-6 h-6" />
              </div>
            </div>

            {/* Game Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-sm text-gray-900 leading-tight">
                  {game.title}
                </h3>
                {game.rank && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 ml-2">
                    #{game.rank}
                  </Badge>
                )}
              </div>

              {/* Rating and Year */}
              <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                {game.geek_rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{game.geek_rating}</span>
                    {game.voters && (
                      <span className="text-gray-400">({game.voters?.toLocaleString()} votes)</span>
                    )}
                  </div>
                )}
                {game.year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{game.year}</span>
                  </div>
                )}
              </div>

              {/* Description Preview */}
              {game.description && (
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {game.description.length > 100 
                    ? `${game.description.substring(0, 100)}...` 
                    : game.description
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
