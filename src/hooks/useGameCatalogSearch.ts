
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GameCatalogItem {
  game_id: number;
  title: string;
  description?: string;
  year?: number;
  geek_rating?: number;
  avg_rating?: number;
  voters?: number;
  rank?: number;
  link?: string;
  thumbnail?: string;
}

export const useGameCatalogSearch = (searchQuery: string) => {
  return useQuery({
    queryKey: ['game-catalog-search', searchQuery],
    queryFn: async (): Promise<GameCatalogItem[]> => {
      if (!searchQuery || searchQuery.trim().length < 2) return [];

      try {
        // Try to query the games table as our primary search
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .ilike('name', `%${searchQuery.trim()}%`)
          .limit(10);

        if (error) {
          console.error('Error searching games:', error);
          return [];
        }

        // Transform games data to match GameCatalogItem interface
        return (data || []).map((game, index) => ({
          game_id: index, // Use index as fallback game_id
          title: game.name,
          description: undefined,
          year: undefined,
          geek_rating: undefined,
          avg_rating: undefined,
          voters: undefined,
          rank: undefined,
          link: undefined,
          thumbnail: game.cover_url || undefined
        }));
      } catch (err) {
        console.error('Search failed:', err);
        return [];
      }
    },
    enabled: !!searchQuery && searchQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  });
};
