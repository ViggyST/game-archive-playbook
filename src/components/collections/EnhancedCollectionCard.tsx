
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
      className="relative overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Game Thumbnail */}
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
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
              <Dice6 className="w-6 h-6" />
            </div>
          </div>

          {/* Game Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
              {item.game_name}
            </h3>

            {/* Metadata Stack */}
            <div className="space-y-1">
              {/* First row: Rank + Rating + Year */}
              <div className="flex items-center gap-3 text-sm">
                {item.rank && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 border-orange-200">
                    BGG #{item.rank}
                  </Badge>
                )}
                {item.geek_rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">{item.geek_rating}</span>
                    {item.voters && (
                      <span className="text-gray-500">({formatVoters(item.voters)})</span>
                    )}
                  </div>
                )}
                {item.year && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.year}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        <div className="space-y-3">
          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Personal Notes Preview */}
          {item.notes && (
            <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-lg">
              <span className="font-medium text-blue-800 text-xs">Your notes:</span>
              <p className="mt-1 text-sm text-blue-700 line-clamp-2">{item.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Added {new Date(item.created_at).toLocaleDateString()}
            </div>
            {item.is_manual && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 text-gray-600">
                Manual Entry
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
