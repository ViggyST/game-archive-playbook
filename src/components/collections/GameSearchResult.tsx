
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Calendar, Image } from 'lucide-react';
import { GameCatalogItem } from '@/hooks/useGameCatalogSearch';

interface GameSearchResultProps {
  game: GameCatalogItem;
  onClick: (game: GameCatalogItem) => void;
  isSelected?: boolean;
}

export const GameSearchResult = ({ game, onClick, isSelected = false }: GameSearchResultProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:border-orange-300 ${
        isSelected ? 'border-orange-500 shadow-lg' : ''
      }`}
      onClick={() => onClick(game)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Game Thumbnail or Fallback */}
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
              <Image className="w-6 h-6" />
            </div>
          </div>

          {/* Game Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm text-gray-900 leading-tight truncate pr-2">
                {game.title}
              </h3>
              {game.rank && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  #{game.rank}
                </Badge>
              )}
            </div>

            {/* Rating and Metadata */}
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
              {game.geek_rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{game.geek_rating}</span>
                  {game.voters && (
                    <span className="text-gray-400">({game.voters} votes)</span>
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

            {/* Description */}
            {game.description && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {game.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
