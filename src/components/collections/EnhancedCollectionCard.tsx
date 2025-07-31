
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Dice6 } from 'lucide-react';

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
  // Catalog data if available
  rank?: number;
  geek_rating?: number;
  voters?: number;
}

interface EnhancedCollectionCardProps {
  item: CollectionItem;
  onClick?: () => void;
}

export const EnhancedCollectionCard = ({ item, onClick }: EnhancedCollectionCardProps) => {
  return (
    <Card 
      className="relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Game Thumbnail */}
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {item.cover_url ? (
              <img 
                src={item.cover_url} 
                alt={item.game_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`${item.cover_url ? 'hidden' : ''} text-gray-400`}>
              <Dice6 className="w-6 h-6" />
            </div>
          </div>

          {/* Game Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                {item.game_name}
              </CardTitle>
              {item.rank && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 ml-2">
                  #{item.rank}
                </Badge>
              )}
            </div>

            {/* Rating */}
            {item.geek_rating && (
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{item.geek_rating}</span>
                {item.voters && (
                  <span className="text-gray-400">({item.voters?.toLocaleString()} votes)</span>
                )}
              </div>
            )}

            {/* Source indicator */}
            {!item.is_manual && (
              <div className="text-xs text-green-600 font-medium mt-1">
                📚 From BGG Catalog
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Description */}
          {item.description && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Personal Notes Preview */}
          {item.notes && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <span className="font-medium text-gray-700">Your notes:</span>
              <p className="mt-1 text-xs line-clamp-2">{item.notes}</p>
            </div>
          )}

          {/* Metadata row */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <span>Added {new Date(item.created_at).toLocaleDateString()}</span>
            {item.complexity && (
              <Badge variant="outline" className="text-xs">
                {item.complexity}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
