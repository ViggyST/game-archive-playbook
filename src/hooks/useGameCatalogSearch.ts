
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

      // Use raw SQL query since game_catalog might not be in the generated types
      const { data, error } = await supabase.rpc('search_game_catalog', {
        search_term: searchQuery.trim()
      });

      if (error) {
        console.error('Error searching game catalog:', error);
        // Fallback to direct query if RPC doesn't exist
        return await fallbackSearch(searchQuery.trim());
      }

      return data || [];
    },
    enabled: !!searchQuery && searchQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  });
};

// Fallback search function that doesn't rely on RPC
async function fallbackSearch(searchTerm: string): Promise<GameCatalogItem[]> {
  try {
    // Try to query the existing games table as a fallback
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .limit(10);

    if (error) {
      console.error('Fallback search error:', error);
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
    console.error('Fallback search failed:', err);
    return [];
  }
}
