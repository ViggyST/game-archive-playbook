/**
 * Canonical query keys for TanStack Query v5
 * Centralized to avoid string heuristics and ensure consistency
 */

export const QUERY_KEYS = {
  CALENDAR_SESSIONS: (playerId: string) => ['calendar-sessions', playerId] as const,
  SESSIONS_BY_DATE: (date: string, playerId: string) => ['sessions-by-date', date, playerId] as const,
  GAME_SESSION_HISTORY: (gameId: string, filterByPlayer?: string) => 
    ['game-session-history', gameId, filterByPlayer] as const,
  PLAYER_GAME_DASHBOARD: (playerId: string, sortBy: 'plays' | 'recent') => 
    ['player-game-dashboard', playerId, sortBy] as const,
  MOST_PLAYED_GAME: (playerId: string) => ['most-played-game', playerId] as const,
  PLAYER_STATS: (playerId: string) => ['player-stats', playerId] as const,
} as const;

/**
 * Edit types and their corresponding query keys to invalidate
 * Maps operation types to exact query keys for cache invalidation
 */
export type EditType = 'scoreUpdate' | 'gameRelink' | 'playerRetag' | 'sessionMetadata';

export const getInvalidationKeys = (
  editType: EditType,
  context: {
    playerId: string;
    gameId?: string;
    oldGameId?: string;
    newGameId?: string;
    date?: string;
  }
): ReadonlyArray<ReturnType<typeof QUERY_KEYS[keyof typeof QUERY_KEYS]>> => {
  const { playerId, gameId, oldGameId, newGameId, date } = context;
  
  const keys: Array<ReturnType<typeof QUERY_KEYS[keyof typeof QUERY_KEYS]>> = [
    QUERY_KEYS.CALENDAR_SESSIONS(playerId),
    QUERY_KEYS.PLAYER_STATS(playerId),
    QUERY_KEYS.MOST_PLAYED_GAME(playerId),
    QUERY_KEYS.PLAYER_GAME_DASHBOARD(playerId, 'plays'),
    QUERY_KEYS.PLAYER_GAME_DASHBOARD(playerId, 'recent'),
  ];

  // Always add date-specific invalidation for all edit types if date is provided
  if (date) {
    keys.push(QUERY_KEYS.SESSIONS_BY_DATE(date, playerId));
  }

  switch (editType) {
    case 'scoreUpdate':
      if (gameId) {
        keys.push(QUERY_KEYS.GAME_SESSION_HISTORY(gameId));
        keys.push(QUERY_KEYS.GAME_SESSION_HISTORY(gameId, playerId));
      }
      break;

    case 'gameRelink':
      // Invalidate both old and new game histories
      if (oldGameId) {
        keys.push(QUERY_KEYS.GAME_SESSION_HISTORY(oldGameId));
        keys.push(QUERY_KEYS.GAME_SESSION_HISTORY(oldGameId, playerId));
      }
      if (newGameId) {
        keys.push(QUERY_KEYS.GAME_SESSION_HISTORY(newGameId));
        keys.push(QUERY_KEYS.GAME_SESSION_HISTORY(newGameId, playerId));
      }
      break;

    case 'playerRetag':
      if (gameId) {
        keys.push(QUERY_KEYS.GAME_SESSION_HISTORY(gameId));
        keys.push(QUERY_KEYS.GAME_SESSION_HISTORY(gameId, playerId));
      }
      break;

    case 'sessionMetadata':
      if (gameId) {
        keys.push(QUERY_KEYS.GAME_SESSION_HISTORY(gameId));
        keys.push(QUERY_KEYS.GAME_SESSION_HISTORY(gameId, playerId));
      }
      break;

    default:
      break;
  }

  return keys;
};