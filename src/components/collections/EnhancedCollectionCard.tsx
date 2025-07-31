
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Dice6, Calendar } from 'lucide-react';

interface CollectionItem {
  id: string;
  game_id: string;
  game_name: string;
  cover_url?: string;
  complexity: string;
  publisher?: string;
  players?: string;
  tags: string[];
  rulebook_url?: string;
  notes?: string;
  is_manual: boolean;
  created_at: string;
  description?: string;
  // Rich catalog metadata
  rank?: number;
  geek_rating?: number;
  voters?: number;
  year?: number;
  thumbnail?: string;
  link?: string;
}

interface EnhancedCollectionCardProps {
  item: CollectionItem;
  onClick?: () => void;
}

export const EnhancedCollectionCard = ({ item, onClick }: EnhancedCollectionCardProps) => {
  const formatVoters = (voters: number) => {
    if (voters >= 1000) {
      return `${Math.round(voters / 100) / 10}k`;
    }
    return voters.toString();
  };

  return (
    <Card 
      className="relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer bg-white"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Game Thumbnail - Larger for better visibility */}
          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
            {item.thumbnail || item.cover_url ? (
              <img 
                src={item.thumbnail || item.cover_url} 
                alt={item.game_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`${(item.thumbnail || item.cover_url) ? 'hidden' : ''} text-gray-400`}>
              <Dice6 className="w-8 h-8" />
            </div>
          </div>

          {/* Game Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                {item.game_name}
              </CardTitle>
            </div>

            {/* BGG Ranking */}
            {item.rank && (
              <div className="mb-2">
                <Badge variant="secondary" className="text-sm px-3 py-1 bg-orange-100 text-orange-700 border-orange-200">
                  Ranked #{item.rank} on BGG
                </Badge>
              </div>
            )}

            {/* Rating and Metadata */}
            <div className="flex items-center gap-4 text-sm mb-3">
              {item.geek_rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{item.geek_rating}</span>
                  {item.voters && (
                    <span className="text-gray-500">({formatVoters(item.voters)} votes)</span>
                  )}
                </div>
              )}
              {item.year && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{item.year}</span>
                </div>
              )}
            </div>

            {/* Source indicator */}
            {!item.is_manual && (
              <div className="text-xs text-green-600 font-medium mb-2 bg-green-50 px-2 py-1 rounded-full inline-block">
                📚 From BGG Catalog
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Description - 2-3 lines as requested */}
          {item.description && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Personal Notes Preview */}
          {item.notes && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <span className="font-medium text-blue-800 text-sm">Your notes:</span>
              <p className="mt-1 text-sm text-blue-700 line-clamp-2">{item.notes}</p>
            </div>
          )}

          {/* Footer with complexity and date */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Added on {new Date(item.created_at).toLocaleDateString()}
            </div>
            {item.complexity && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                {item.complexity}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
