
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

export const useCalendarSessions = () => {
  return useQuery({
    queryKey: ['calendar-sessions'],
    queryFn: async (): Promise<CalendarSession[]> => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          date,
          games!inner(
            name,
            weight
          )
        `)
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
    staleTime: 5 * 60 * 1000,
  });
};

export const useSessionsByDate = (selectedDate: string) => {
  return useQuery({
    queryKey: ['sessions-by-date', selectedDate],
    queryFn: async (): Promise<GameSession[]> => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          games!inner(name),
          scores!inner(
            score,
            is_winner,
            players!inner(name)
          ),
          location,
          duration_minutes,
          highlights
        `)
        .eq('date', selectedDate);

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
