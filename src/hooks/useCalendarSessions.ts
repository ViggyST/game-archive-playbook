
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CalendarSession {
  date: string;
  sessions: number;
  weight: string;
}

export interface GameSession {
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
    queryFn: async (): Promise<Record<string, CalendarSession>> => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          date,
          games!inner(weight)
        `)
        .order('date');

      if (error) {
        console.error('Error fetching calendar sessions:', error);
        return {};
      }

      // Group by date and count sessions
      const sessionsByDate = data.reduce((acc: Record<string, CalendarSession>, session) => {
        const dateKey = session.date;
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: dateKey,
            sessions: 0,
            weight: session.games?.weight || 'Medium'
          };
        }
        acc[dateKey].sessions++;
        return acc;
      }, {});

      return sessionsByDate;
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
