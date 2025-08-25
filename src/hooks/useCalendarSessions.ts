
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CalendarSession {
  date: string;
  game_name: string;
  game_weight: string;
  session_id: string;
}

export interface GameSession {
  session_id: string;
  game_name: string;
  player_name: string;
  score: number;
  is_winner: boolean;
  location: string;
  duration_minutes: number;
  highlights: string;
}

export const useCalendarSessions = (playerId?: string) => {
  return useQuery({
    queryKey: ['calendar-sessions', playerId],
    queryFn: async (): Promise<CalendarSession[]> => {
      // Build the query with player filtering
      let query = supabase
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
        `);

      // Filter by player if playerId is provided
      if (playerId) {
        query = query.eq('scores.player_id', playerId);
      }

      const { data, error } = await query.order('date');

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
    enabled: playerId ? !!playerId : true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSessionsByDate = (selectedDate: string, playerId?: string) => {
  return useQuery({
    queryKey: ['sessions-by-date', selectedDate, playerId],
    queryFn: async (): Promise<GameSession[]> => {
      // Build the base query
      let query = supabase
        .from('sessions')
        .select(`
          id,
          games!inner(name),
          scores!inner(
            score,
            is_winner,
            player_id,
            players!inner(name)
          ),
          location,
          duration_minutes,
          highlights
        `)
        .eq('date', selectedDate);

      // Filter by player if playerId is provided
      if (playerId) {
        query = query.eq('scores.player_id', playerId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching sessions by date:', error);
        return [];
      }

      // Flatten the data structure
      const sessions: GameSession[] = [];
      data.forEach(session => {
        session.scores?.forEach(score => {
          sessions.push({
            session_id: session.id,
            game_name: session.games?.name || '',
            player_name: score.players?.name || '',
            score: score.score || 0,
            is_winner: score.is_winner || false,
            location: session.location || '',
            duration_minutes: session.duration_minutes || 0,
            highlights: session.highlights || ''
          });
        });
      });

      return sessions;
    },
    enabled: !!selectedDate,
    staleTime: 5 * 60 * 1000,
  });
};
