
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

      const { data, error } = await supabase
        .from('game_catalog')
        .select('*')
        .ilike('title', `%${searchQuery.trim()}%`)
        .limit(10);

      if (error) {
        console.error('Error searching game catalog:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!searchQuery && searchQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  });
};
