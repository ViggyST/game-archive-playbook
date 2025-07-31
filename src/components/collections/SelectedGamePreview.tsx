
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Dice6 } from 'lucide-react';
import { GameCatalogItem } from '@/hooks/useGameCatalogSearch';

interface SelectedGamePreviewProps {
  game: GameCatalogItem;
}

export const SelectedGamePreview = ({ game }: SelectedGamePreviewProps) => {
  return (
    <Card className="bg-orange-50 border-orange-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Game Thumbnail */}
          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
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
              <Dice6 className="w-8 h-8" />
            </div>
          </div>

          {/* Game Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {game.title}
              </h3>
              {game.rank && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  BGG #{game.rank}
                </Badge>
              )}
            </div>

            {/* Rating and Year Row */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              {game.geek_rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{game.geek_rating}</span>
                  {game.voters && (
                    <span className="text-gray-500">({game.voters?.toLocaleString()} votes)</span>
                  )}
                </div>
              )}
              {game.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{game.year}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {game.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {game.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
