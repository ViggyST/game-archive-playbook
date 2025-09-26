
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";
import { getCurrentDateIST } from "@/lib/utils";

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
  player_id: string;
  score_id: string;
  score: number;
  is_winner: boolean;
  location: string;
  duration_minutes: number;
  highlights: string;
}

export const useCalendarSessions = () => {
  const { player } = usePlayerContext();
  
  return useQuery({
    queryKey: ['calendar-sessions', player?.id],
    queryFn: async (): Promise<CalendarSession[]> => {
      if (!player?.id) return [];

      const todayIST = getCurrentDateIST();
      
      // Using scores!inner(...) pattern: sessions without active scores are filtered out
      // This provides cleaner UX by excluding sessions where all scores are soft-deleted
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
        .is('deleted_at', null)
        .is('scores.deleted_at', null)
        .lte('date', todayIST)
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
    queryKey: ['sessions-by-date', selectedDate, player?.id],
    queryFn: async (): Promise<GameSession[]> => {
      if (!player?.id || !selectedDate) return [];

      // First, get session IDs where the current player participated on the selected date
      const { data: playerScores, error: scoresError } = await supabase
        .from('scores')
        .select('session_id')
        .eq('player_id', player.id)
        .is('deleted_at', null);

      if (scoresError) {
        console.error('Error fetching player scores:', scoresError);
        return [];
      }

      const playerSessionIds = playerScores?.map(s => s.session_id) || [];
      if (playerSessionIds.length === 0) return [];

      // Using scores!inner(...) pattern: sessions without active scores are filtered out
      // This provides cleaner UX by excluding sessions where all scores are soft-deleted
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
        .is('deleted_at', null)
        .is('scores.deleted_at', null);

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
            player_id: score.player_id || '',
            score_id: score.id || '',
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
    enabled: !!selectedDate && !!player?.id,
    staleTime: 5 * 60 * 1000,
  });
};
