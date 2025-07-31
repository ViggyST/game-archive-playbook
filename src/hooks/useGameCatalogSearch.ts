
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
        // First try to search the game_catalog table
        const { data: catalogData, error: catalogError } = await supabase
          .from('game_catalog')
          .select('*')
          .ilike('title', `%${searchQuery.trim()}%`)
          .order('rank', { ascending: true, nullsLast: true })
          .limit(10);

        if (!catalogError && catalogData && catalogData.length > 0) {
          return catalogData.map(game => ({
            game_id: game.game_id,
            title: game.title,
            description: game.description,
            year: game.year,
            geek_rating: game.geek_rating ? Number(game.geek_rating) : undefined,
            avg_rating: game.avg_rating ? Number(game.avg_rating) : undefined,
            voters: game.voters,
            rank: game.rank,
            link: game.link,
            thumbnail: game.thumbnail
          }));
        }

        // Fallback to games table if catalog search fails
        const { data: gamesData, error: gamesError } = await supabase
          .from('games')
          .select('*')
          .ilike('name', `%${searchQuery.trim()}%`)
          .limit(10);

        if (gamesError) {
          console.error('Error searching games:', gamesError);
          return [];
        }

        return (gamesData || []).map((game, index) => ({
          game_id: index,
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
