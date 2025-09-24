import { useQueryClient } from '@tanstack/react-query';
import { EditType, getInvalidationKeys } from './queryKeys';

/**
 * Centralized cache invalidation helper for session data
 * Uses exact query keys to avoid string heuristics
 */
export const createCacheInvalidator = (queryClient: ReturnType<typeof useQueryClient>) => {
  const invalidateSessionData = async (
    editType: EditType,
    context: {
      playerId: string;
      gameId?: string;
      oldGameId?: string;
      newGameId?: string;
      date?: string;
    }
  ) => {
    const keys = getInvalidationKeys(editType, context);
    
    // Invalidate all affected queries in parallel
    await Promise.all(
      keys.map(key => 
        queryClient.invalidateQueries({ queryKey: key })
      )
    );

    // Log for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Invalidated ${keys.length} query keys for ${editType}:`, keys);
    }
  };

  return { invalidateSessionData };
};