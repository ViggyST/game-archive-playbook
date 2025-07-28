
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";
import { useToast } from "@/hooks/use-toast";

export interface CollectionItem {
  id: string;
  game_id: string;
  collection_type: 'owned' | 'wishlist';
  rulebook_url?: string;
  notes?: string;
  is_manual: boolean;
  created_at: string;
  game: {
    id: string;
    name: string;
    weight?: string;
    cover_url?: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
}

export const usePlayerCollections = () => {
  const { player } = usePlayerContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['collections', player?.id],
    queryFn: async () => {
      if (!player?.id) return [];

      try {
        // Use type assertion to work around TypeScript issues
        const { data, error } = await (supabase as any)
          .from('collections')
          .select(`
            id,
            game_id,
            collection_type,
            rulebook_url,
            notes,
            is_manual,
            created_at,
            games (
              id,
              name,
              weight,
              cover_url
            ),
            collection_tags (
              tags (
                id,
                name
              )
            )
          `)
          .eq('player_id', player.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching collections:', error);
          return [];
        }

        return data?.map((item: any) => ({
          ...item,
          game: item.games,
          tags: item.collection_tags?.map((ct: any) => ct.tags) || []
        })) || [];
      } catch (error) {
        console.error('Error in collections query:', error);
        return [];
      }
    },
    enabled: !!player?.id
  });

  const addToCollectionMutation = useMutation({
    mutationFn: async (params: {
      gameName: string;
      collectionType: 'owned' | 'wishlist';
      complexity?: string;
      tags?: string[];
      rulebookUrl?: string;
      notes?: string;
    }) => {
      if (!player?.id) throw new Error('No player selected');

      try {
        // First, try to find existing game
        let gameId: string;
        const { data: existingGame } = await supabase
          .from('games')
          .select('id')
          .eq('name', params.gameName)
          .single();

        if (existingGame) {
          gameId = existingGame.id;
        } else {
          // Create new game
          const { data: newGame, error: gameError } = await supabase
            .from('games')
            .insert({
              name: params.gameName,
              weight: params.complexity || null
            })
            .select('id')
            .single();

          if (gameError) throw gameError;
          gameId = newGame.id;
        }

        // Add to collection using type assertion
        const { data: collection, error: collectionError } = await (supabase as any)
          .from('collections')
          .insert({
            player_id: player.id,
            game_id: gameId,
            collection_type: params.collectionType,
            rulebook_url: params.rulebookUrl || null,
            notes: params.notes || null,
            is_manual: true
          })
          .select('id')
          .single();

        if (collectionError) throw collectionError;

        // Add tags if provided
        if (params.tags && params.tags.length > 0) {
          for (const tagName of params.tags) {
            // Get or create tag
            const { data: existingTag } = await (supabase as any)
              .from('tags')
              .select('id')
              .eq('name', tagName)
              .single();

            let tagId: string;
            if (existingTag) {
              tagId = existingTag.id;
            } else {
              const { data: newTag, error: tagError } = await (supabase as any)
                .from('tags')
                .insert({ name: tagName })
                .select('id')
                .single();

              if (tagError) throw tagError;
              tagId = newTag.id;
            }

            // Link tag to collection
            await (supabase as any)
              .from('collection_tags')
              .insert({
                collection_id: collection.id,
                tag_id: tagId
              });
          }
        }

        return collection;
      } catch (error) {
        console.error('Error adding to collection:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', player?.id] });
      toast({
        title: "Game added to collection!",
        description: "Your game has been successfully added."
      });
    },
    onError: (error) => {
      console.error('Error adding to collection:', error);
      toast({
        title: "Error",
        description: "Failed to add game to collection. Please try again.",
        variant: "destructive"
      });
    }
  });

  const ownedGames = collections.filter(item => item.collection_type === 'owned');
  const wishlistGames = collections.filter(item => item.collection_type === 'wishlist');

  return {
    collections,
    ownedGames,
    wishlistGames,
    isLoading,
    addToCollection: addToCollectionMutation.mutate,
    isAddingToCollection: addToCollectionMutation.isPending
  };
};
