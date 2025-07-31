
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePlayerContext } from '@/context/PlayerContext';

export interface CollectionItem {
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

export const usePlayerCollections = (collectionType: 'owned' | 'wishlist') => {
  const { player } = usePlayerContext();

  return useQuery({
    queryKey: ['player-collections', player?.id, collectionType],
    queryFn: async (): Promise<CollectionItem[]> => {
      if (!player?.id) return [];

      const { data, error } = await supabase
        .from('collections')
        .select(`
          id,
          game_id,
          rulebook_url,
          notes,
          is_manual,
          created_at,
          games!inner(
            id,
            name,
            cover_url,
            weight
          ),
          collection_tags(
            tags(
              name
            )
          )
        `)
        .eq('player_id', player.id)
        .eq('collection_type', collectionType)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching collections:', error);
        return [];
      }

      // For each collection item, also fetch catalog data if it exists
      const enrichedData = await Promise.all(
        data.map(async (item) => {
          let catalogData = null;
          
          // Only fetch catalog data for non-manual entries
          if (!item.is_manual && item.games?.id) {
            try {
              // Try to find matching catalog data using the game name
              const { data: catalog, error: catalogError } = await (supabase as any)
                .from('game_catalog')
                .select('*')
                .ilike('title', item.games.name)
                .limit(1)
                .single();

              if (!catalogError && catalog) {
                catalogData = catalog;
              }
            } catch (err) {
              // Ignore catalog fetch errors - we'll just use basic game data
              console.log('No catalog data found for:', item.games?.name);
            }
          }

          return {
            id: item.id,
            game_id: item.game_id,
            game_name: item.games?.name || '',
            cover_url: catalogData?.thumbnail || item.games?.cover_url || undefined,
            complexity: item.games?.weight || 'Medium',
            publisher: undefined, // Will be populated later if needed
            players: undefined, // Will be populated later if needed
            tags: item.collection_tags?.map(ct => ct.tags?.name).filter(Boolean) || [],
            rulebook_url: item.rulebook_url || undefined,
            notes: item.notes || undefined,
            is_manual: item.is_manual || false,
            created_at: item.created_at,
            description: catalogData?.description || undefined,
            // Rich catalog metadata
            rank: catalogData?.rank || undefined,
            geek_rating: catalogData?.geek_rating ? Number(catalogData.geek_rating) : undefined,
            voters: catalogData?.voters || undefined,
            year: catalogData?.year || undefined,
            thumbnail: catalogData?.thumbnail || undefined,
            link: catalogData?.link || undefined
          };
        })
      );

      return enrichedData;
    },
    enabled: !!player?.id,
    staleTime: 5 * 60 * 1000,
  });
};
