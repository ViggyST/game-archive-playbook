
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

  // Function to get a color for tags based on their content
  const getTagColor = (tag: string, index: number) => {
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
      'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
      'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700',
      'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
      'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
      'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700'
    ];
    
    // Use tag content hash to consistently assign colors
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <Card 
      className="relative overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer bg-[var(--surface)] border border-[var(--border)]"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Game Thumbnail */}
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
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
            <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight mb-1">
              {item.game_name}
            </h3>

            {/* Metadata Stack */}
            <div className="space-y-1">
              {/* First row: Rank + Rating + Year */}
              <div className="flex items-center gap-3 text-sm">
                {item.rank && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700">
                    BGG #{item.rank}
                  </Badge>
                )}
                {item.geek_rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-[var(--text-primary)]">{item.geek_rating}</span>
                    {item.voters && (
                      <span className="text-[var(--text-secondary)]">({formatVoters(item.voters)})</span>
                    )}
                  </div>
                )}
                {item.year && (
                  <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.year}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
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
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`text-xs px-2 py-0.5 ${getTagColor(tag, index)}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Personal Notes Preview - More Compact */}
          {item.notes && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-2 rounded-lg">
              <span className="font-medium text-blue-800 dark:text-blue-200 text-xs">Your notes:</span>
              <p className="mt-0.5 text-xs text-blue-700 dark:text-blue-300 line-clamp-2">{item.notes}</p>
            </div>
          )}

          {/* Footer - Only Manual Entry Badge */}
          {item.is_manual && (
            <div className="flex justify-end pt-2 border-t border-[var(--border)]">
              <Badge variant="outline" className="text-xs px-2 py-0.5 text-[var(--text-secondary)]">
                Manual Entry
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
