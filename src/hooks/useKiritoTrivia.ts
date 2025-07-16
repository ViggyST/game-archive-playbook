
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const KIRITO_PLAYER_ID = '3db5dc38-1f5d-499f-bece-b1c20e31f838';

export const useKiritoTrivia = () => {
  return useQuery({
    queryKey: ['kirito-trivia'],
    queryFn: async () => {
      console.log('Fetching Kirito trivia facts...');
      
      // Get session data with location and duration info
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select(`
          id,
          location,
          duration_minutes,
          date,
          games (name)
        `)
        .in('id', 
          await supabase
            .from('scores')
            .select('session_id')
            .eq('player_id', KIRITO_PLAYER_ID)
            .then(({ data }) => data?.map(score => score.session_id) || [])
        );
      
      if (sessionError) {
        console.error('Error fetching session data:', sessionError);
        throw sessionError;
      }
      
      // Get player interaction data
      const { data: playerData, error: playerError } = await supabase
        .from('scores')
        .select(`
          session_id,
          sessions!inner (
            id,
            games (name)
          ),
          players!inner (name)
        `)
        .neq('player_id', KIRITO_PLAYER_ID);
      
      if (playerError) {
        console.error('Error fetching player data:', playerError);
        throw playerError;
      }
      
      // Calculate trivia facts
      const homeSessions = sessionData.filter(s => s.location?.toLowerCase().includes('home')).length;
      const shortestGame = sessionData
        .filter(s => s.duration_minutes)
        .sort((a, b) => (a.duration_minutes || 0) - (b.duration_minutes || 0))[0];
      
      // Count games with specific players
      const kiritoSessionIds = new Set(sessionData.map(s => s.id));
      const playersWithKirito = playerData.filter(p => kiritoSessionIds.has(p.session_id));
      const bogiGames = playersWithKirito.filter(p => p.players?.name === 'Bogi').length;
      
      // Get day of week stats
      const dayStats = sessionData.reduce((acc, session) => {
        const day = new Date(session.date).getDay();
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
        if (!acc[dayName]) {
          acc[dayName] = { total: 0, wins: 0 };
        }
        acc[dayName].total++;
        return acc;
      }, {} as Record<string, { total: number; wins: number }>);
      
      // Get win data by day
      const { data: winsByDay, error: winsByDayError } = await supabase
        .from('scores')
        .select(`
          is_winner,
          sessions!inner (date)
        `)
        .eq('player_id', KIRITO_PLAYER_ID)
        .eq('is_winner', true);
      
      if (!winsByDayError && winsByDay) {
        winsByDay.forEach(win => {
          const day = new Date(win.sessions.date).getDay();
          const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
          if (dayStats[dayName]) {
            dayStats[dayName].wins++;
          }
        });
      }
      
      const bestDay = Object.entries(dayStats)
        .filter(([, stats]) => stats.total >= 2)
        .map(([day, stats]) => ({ day, winRate: Math.round((stats.wins / stats.total) * 100) }))
        .sort((a, b) => b.winRate - a.winRate)[0];
      
      const facts = [
        homeSessions > 0 ? `You've logged ${homeSessions} sessions at home.` : "You love exploring new gaming venues!",
        shortestGame ? `Your shortest game lasted ${shortestGame.duration_minutes} mins.` : "Every game is an adventure!",
        bogiGames > 0 ? `You've played ${bogiGames} different games with Bogi.` : "Time to invite more friends to game night!",
        bestDay ? `${bestDay.day}s have your highest win rate at ${bestDay.winRate}%.` : "Every day is a good day for gaming!",
        sessionData.length > 5 ? "You're building an amazing gaming journey!" : "Your gaming adventure is just beginning!",
        "The best games are the ones shared with friends! 🎲",
        "Every session logged is a memory preserved! 📝"
      ];
      
      console.log('Trivia facts generated:', facts);
      
      return facts.filter(Boolean);
    }
  });
};
