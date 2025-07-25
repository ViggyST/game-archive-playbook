
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePlayerContext } from "@/context/PlayerContext";

export const useKiritoAllTimeStats = () => {
  const { player } = usePlayerContext();

  return useQuery({
    queryKey: ['player-all-time-stats', player?.id],
    queryFn: async () => {
      if (!player?.id) {
        return { gamesPlayed: 0, gamesWon: 0, winRate: 0 };
      }

      console.log('Fetching all-time stats for player:', player.id);
      
      // Get total games played
      const { data: gamesPlayedData, error: gamesPlayedError } = await supabase
        .from('scores')
        .select('session_id')
        .eq('player_id', player.id);
      
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
        .eq('player_id', player.id)
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
    },
    enabled: !!player?.id,
  });
};
