
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GameData } from "@/pages/LogGame";
import { toast } from "sonner";

export const useLogGame = () => {
  return useMutation({
    mutationFn: async (gameData: GameData) => {
      console.log("Starting game log process:", gameData);
      
      // Step 1: Insert or get existing game
      let gameId: string;
      
      // Check if game already exists
      const { data: existingGame } = await supabase
        .from('games')
        .select('id')
        .eq('name', gameData.name)
        .single();
      
      if (existingGame) {
        gameId = existingGame.id;
        console.log("Using existing game:", gameId);
      } else {
        // Insert new game
        const { data: newGame, error: gameError } = await supabase
          .from('games')
          .insert({
            name: gameData.name,
            weight: gameData.complexity.toLowerCase(), // Convert to lowercase
            cover_url: gameData.coverImage || null
          })
          .select('id')
          .single();
        
        if (gameError) {
          console.error("Error inserting game:", gameError);
          throw new Error(`Failed to create game: ${gameError.message}`);
        }
        
        gameId = newGame.id;
        console.log("Created new game:", gameId);
      }
      
      // Step 2: Insert or get existing players
      const playerIds: { [playerId: string]: string } = {};
      
      for (const player of gameData.players) {
        // Check if player already exists
        const { data: existingPlayer } = await supabase
          .from('players')
          .select('id')
          .eq('name', player.name)
          .single();
        
        if (existingPlayer) {
          playerIds[player.id] = existingPlayer.id;
          console.log("Using existing player:", player.name, existingPlayer.id);
        } else {
          // Insert new player
          const { data: newPlayer, error: playerError } = await supabase
            .from('players')
            .insert({
              name: player.name,
              avatar_url: player.avatar || null
            })
            .select('id')
            .single();
          
          if (playerError) {
            console.error("Error inserting player:", playerError);
            throw new Error(`Failed to create player ${player.name}: ${playerError.message}`);
          }
          
          playerIds[player.id] = newPlayer.id;
          console.log("Created new player:", player.name, newPlayer.id);
        }
      }
      
      // Step 3: Insert session
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          game_id: gameId,
          date: gameData.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
          location: gameData.location,
          duration_minutes: gameData.duration,
          highlights: gameData.highlights || null
        })
        .select('id')
        .single();
      
      if (sessionError) {
        console.error("Error inserting session:", sessionError);
        throw new Error(`Failed to create session: ${sessionError.message}`);
      }
      
      console.log("Created session:", session.id);
      
      // Step 4: Insert scores for each player
      const scoresData = gameData.players.map(player => ({
        session_id: session.id,
        player_id: playerIds[player.id],
        score: gameData.scores[player.id] || 0,
        is_winner: gameData.winner === player.id
      }));
      
      const { error: scoresError } = await supabase
        .from('scores')
        .insert(scoresData);
      
      if (scoresError) {
        console.error("Error inserting scores:", scoresError);
        throw new Error(`Failed to create scores: ${scoresError.message}`);
      }
      
      console.log("Created scores for", scoresData.length, "players");
      
      return { sessionId: session.id, gameId };
    },
    onSuccess: (data) => {
      console.log("Game logged successfully:", data);
      toast.success("Game logged successfully! 🎮", {
        description: "Your game session has been saved."
      });
    },
    onError: (error) => {
      console.error("Failed to log game:", error);
      toast.error("Failed to log game", {
        description: error.message || "Please try again."
      });
    }
  });
};
