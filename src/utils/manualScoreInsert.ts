
import { supabase } from "@/integrations/supabase/client";

export const insertMissingScores = async () => {
  const sessionId = "f834e968-0368-4a0c-9230-67865edd9717";
  
  // First, get player IDs by their names
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, name')
    .in('name', ['Bogi', 'Kirito', 'Meepledeen']);
  
  if (playersError) {
    console.error("Error fetching players:", playersError);
    return;
  }
  
  console.log("Found players:", players);
  
  // Create player name to ID mapping
  const playerMap: { [name: string]: string } = {};
  players?.forEach(player => {
    playerMap[player.name] = player.id;
  });
  
  // Prepare scores data
  const scoresData = [
    {
      session_id: sessionId,
      player_id: playerMap['Bogi'],
      score: 2,
      is_winner: true
    },
    {
      session_id: sessionId,
      player_id: playerMap['Kirito'],
      score: 0,
      is_winner: false
    },
    {
      session_id: sessionId,
      player_id: playerMap['Meepledeen'],
      score: 0,
      is_winner: false
    }
  ];
  
  console.log("Inserting scores data:", scoresData);
  
  // Insert the scores
  const { data: insertedScores, error: scoresError } = await supabase
    .from('scores')
    .insert(scoresData)
    .select();
  
  if (scoresError) {
    console.error("Error inserting scores:", scoresError);
    return;
  }
  
  console.log("Successfully inserted missing scores:", insertedScores);
  return insertedScores;
};

// Removed auto-execution - function is now only available for manual use
