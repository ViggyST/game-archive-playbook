
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const KIRITO_PLAYER_ID = '3db5dc38-1f5d-499f-bece-b1c20e31f838';

export const useKiritoAllTimeStats = () => {
  return useQuery({
    queryKey: ['kirito-all-time-stats'],
    queryFn: async () => {
      console.log('Fetching Kirito all-time stats...');
      
      // Get total games played
      const { data: gamesPlayedData, error: gamesPlayedError } = await supabase
        .from('scores')
        .select('session_id')
        .eq('player_id', KIRITO_PLAYER_ID);
      
      if (gamesPlayedError) {
        console.error('Error fetching games played:', gamesPlayedError);
        throw gamesPlayedError;
      }
      
      const uniqueSessionIds = [...new Set(gamesPlayedData.map(score => score.session_id))];
      const gamesPlayed = uniqueSessionIds.length;
      
      // Get total games won
      const { data: gamesWonData, error: gamesWonError } = await supabase
        .from('scores')
        .select('*')
        .eq('player_id', KIRITO_PLAYER_ID)
        .eq('is_winner', true);
      
      if (gamesWonError) {
        console.error('Error fetching games won:', gamesWonError);
        throw gamesWonError;
      }
      
      const gamesWon = gamesWonData.length;
      const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
      
      console.log('All-time stats:', { gamesPlayed, gamesWon, winRate });
      
      return {
        gamesPlayed,
        gamesWon,
        winRate
      };
    }
  });
};
