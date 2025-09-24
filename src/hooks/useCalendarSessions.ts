
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";
import { CalendarSession, GameSession } from "@/types/session";
import { QUERY_KEYS } from "@/lib/queryKeys";

// TODO: Remove boundary adapter by 2025-10-15 - temporary mapping for player_name → name
const mapLegacyPlayerName = (session: any): GameSession => ({
  ...session,
  name: session.player_name || session.name, // Map player_name to canonical name field
});

export const useCalendarSessions = () => {
  const { player } = usePlayerContext();
  
  return useQuery({
    queryKey: QUERY_KEYS.CALENDAR_SESSIONS(player?.id || ''),
    queryFn: async (): Promise<CalendarSession[]> => {
      if (!player?.id) return [];

      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          date,
          games!inner(
            name,
            weight
          ),
          scores!inner(
            player_id
          )
        `)
        .eq('scores.player_id', player.id)
        .is('deleted_at', null)  // Exclude soft-deleted sessions
        .is('scores.deleted_at', null)  // Exclude soft-deleted scores
        .order('date');

      if (error) {
        console.error('Error fetching calendar sessions:', error);
        return [];
      }

      // Transform to flat array of sessions with proper game weight
      const sessions: CalendarSession[] = data.map(session => ({
        date: session.date,
        game_name: session.games?.name || '',
        game_weight: session.games?.weight || 'Medium',
        session_id: session.id
      }));

      return sessions;
    },
    enabled: !!player?.id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSessionsByDate = (selectedDate: string) => {
  const { player } = usePlayerContext();
  
  return useQuery({
    queryKey: QUERY_KEYS.SESSIONS_BY_DATE(selectedDate, player?.id || ''),
    queryFn: async (): Promise<GameSession[]> => {
      if (!player?.id || !selectedDate) return [];

      // First, get session IDs where the current player participated on the selected date
      const { data: playerScores, error: scoresError } = await supabase
        .from('scores')
        .select('session_id')
        .eq('player_id', player.id)
        .is('deleted_at', null);  // Exclude soft-deleted scores

      if (scoresError) {
        console.error('Error fetching player scores:', scoresError);
        return [];
      }

      const playerSessionIds = playerScores?.map(s => s.session_id) || [];
      if (playerSessionIds.length === 0) return [];

      // Then get all players and details for those sessions on the selected date
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          games!inner(name),
          scores!inner(
            id,
            player_id,
            score,
            is_winner,
            players!inner(name)
          ),
          location,
          duration_minutes,
          highlights
        `)
        .eq('date', selectedDate)
        .in('id', playerSessionIds)
        .is('deleted_at', null)  // Exclude soft-deleted sessions
        .is('scores.deleted_at', null);  // Exclude soft-deleted scores

      if (error) {
        console.error('Error fetching sessions by date:', error);
        return [];
      }

      // Flatten the data structure
      const sessions: GameSession[] = [];
      data.forEach(session => {
        session.scores?.forEach(score => {
          const gameSession: GameSession = {
            session_id: session.id,
            game_name: session.games?.name || '',
            name: score.players?.name || '',  // Use canonical 'name' field
            player_id: score.player_id || '',
            score_id: score.id || '',
            score: score.score || 0,
            is_winner: score.is_winner || false,
            location: session.location || '',
            duration_minutes: session.duration_minutes || 0,
            highlights: session.highlights || ''
          };
          
          // Runtime validation in development
          if (process.env.NODE_ENV === 'development') {
            if (!gameSession.player_id || !gameSession.score_id) {
              console.warn('Missing player_id or score_id in GameSession:', gameSession);
            }
          }
          
          sessions.push(gameSession);
        });
      });

      return sessions;
    },
    enabled: !!selectedDate && !!player?.id,
    staleTime: 5 * 60 * 1000,
  });
};
