
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
          catalog_game_id,
          rulebook_url,
          notes,
          is_manual,
          created_at,
          game_catalog!collections_catalog_game_id_fkey(
            game_id,
            title,
            description,
            thumbnail,
            year,
            rank,
            geek_rating,
            avg_rating,
            voters,
            link
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

      // Transform data to expected format
      const transformedData = data.map((item) => ({
        id: item.id,
        game_id: item.catalog_game_id.toString(), // For backwards compatibility
        game_name: item.game_catalog?.title || 'Unknown Game',
        cover_url: item.game_catalog?.thumbnail || undefined,
        complexity: 'Medium', // Default complexity
        publisher: undefined,
        players: undefined,
        tags: item.collection_tags?.map(ct => ct.tags?.name).filter(Boolean) || [],
        rulebook_url: item.rulebook_url || undefined,
        notes: item.notes || undefined,
        is_manual: item.is_manual || false,
        created_at: item.created_at,
        description: item.game_catalog?.description || undefined,
        // Rich catalog metadata
        rank: item.game_catalog?.rank || undefined,
        geek_rating: item.game_catalog?.geek_rating ? Number(item.game_catalog.geek_rating) : undefined,
        voters: item.game_catalog?.voters || undefined,
        year: item.game_catalog?.year || undefined,
        thumbnail: item.game_catalog?.thumbnail || undefined,
        link: item.game_catalog?.link || undefined
      }));

      return transformedData;
    },
    enabled: !!player?.id,
    staleTime: 0, // Always fetch fresh data
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes but allow stale
  });
};
