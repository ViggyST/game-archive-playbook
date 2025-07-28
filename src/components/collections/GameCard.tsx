
import { ExternalLink, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CollectionItem } from "@/hooks/usePlayerCollections";

interface GameCardProps {
  game: CollectionItem;
}

const GameCard = ({ game }: GameCardProps) => {
  const getComplexityColor = (weight?: string) => {
    switch (weight?.toLowerCase()) {
      case 'light':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'heavy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Game Cover */}
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {game.game.cover_url ? (
              <img 
                src={game.game.cover_url} 
                alt={game.game.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-2xl">🎲</div>
            )}
          </div>

          {/* Game Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-poppins font-semibold text-base text-gray-900 truncate">
                {game.game.name}
              </h3>
              {game.rulebook_url && (
                <a
                  href={game.rulebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 flex-shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Complexity Badge */}
            {game.game.weight && (
              <Badge 
                variant="outline" 
                className={`text-xs font-medium mb-2 ${getComplexityColor(game.game.weight)}`}
              >
                {game.game.weight}
              </Badge>
            )}

            {/* Tags */}
            {game.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {game.tags.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag.id}
                    variant="secondary"
                    className="text-xs font-normal bg-gray-100 text-gray-700 border-0"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.name}
                  </Badge>
                ))}
                {game.tags.length > 3 && (
                  <Badge 
                    variant="secondary"
                    className="text-xs font-normal bg-gray-100 text-gray-700 border-0"
                  >
                    +{game.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Notes */}
            {game.notes && (
              <p className="text-sm text-gray-500 mt-2 truncate">
                {game.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
