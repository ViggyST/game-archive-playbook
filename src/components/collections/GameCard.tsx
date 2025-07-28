
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CollectionItem } from "@/hooks/usePlayerCollections";

interface GameCardProps {
  game: CollectionItem;
}

const GameCard = ({ game }: GameCardProps) => {
  const getComplexityBadge = (weight?: string) => {
    if (!weight) return null;
    
    const complexity = weight.toLowerCase();
    let variant: "default" | "secondary" | "destructive" = "default";
    let color = "";

    if (complexity === "light") {
      variant = "secondary";
      color = "bg-green-100 text-green-800 border-green-200";
    } else if (complexity === "medium") {
      variant = "default";
      color = "bg-blue-100 text-blue-800 border-blue-200";
    } else if (complexity === "heavy") {
      variant = "destructive";
      color = "bg-red-100 text-red-800 border-red-200";
    }

    return (
      <Badge className={`${color} font-inter text-xs`}>
        {weight}
      </Badge>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Game Cover */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
            {game.game.cover_url ? (
              <img 
                src={game.game.cover_url} 
                alt={game.game.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-2xl">🎲</span>
            )}
          </div>
        </div>

        {/* Game Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-poppins font-semibold text-lg text-gray-900 truncate">
                {game.game.name}
              </h3>
              
              {/* Complexity Badge */}
              <div className="mt-1">
                {getComplexityBadge(game.game.weight)}
              </div>
            </div>

            {/* Rulebook Link */}
            {game.rulebook_url && (
              <button
                onClick={() => window.open(game.rulebook_url, '_blank')}
                className="ml-2 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                title="View rulebook"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Tags */}
          {game.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {game.tags.map((tag) => (
                <Badge 
                  key={tag.id}
                  variant="outline"
                  className="font-inter text-xs text-gray-600 bg-gray-50 border-gray-200"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Notes */}
          {game.notes && (
            <p className="font-inter text-sm text-gray-500 mt-2 line-clamp-2">
              {game.notes}
            </p>
          )}

          {/* Collection Type Indicator */}
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1 text-xs font-inter ${
              game.collection_type === 'owned' 
                ? 'text-green-600' 
                : 'text-purple-600'
            }`}>
              {game.collection_type === 'owned' ? '🎮 Owned' : '📝 Wishlist'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
