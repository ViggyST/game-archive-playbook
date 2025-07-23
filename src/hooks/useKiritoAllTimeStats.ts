
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export const useKiritoAllTimeStats = () => {
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  useEffect(() => {
    const playerId = localStorage.getItem('active_player');
    setActivePlayerId(playerId);
  }, []);

  return useQuery({
    queryKey: ['player-all-time-stats', activePlayerId],
    queryFn: async () => {
      if (!activePlayerId) {
        return { gamesPlayed: 0, gamesWon: 0, winRate: 0 };
      }

      console.log('Fetching all-time stats for player:', activePlayerId);
      
      // Get total games played
      const { data: gamesPlayedData, error: gamesPlayedError } = await supabase
        .from('scores')
        .select('session_id')
        .eq('player_id', activePlayerId);
      
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
        .eq('player_id', activePlayerId)
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
    enabled: !!activePlayerId,
  });
};
