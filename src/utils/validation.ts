
export function evalStep2(gameData: {
  players: { id: string; name?: string }[];
  scores: Record<string, number | undefined>;
  winner?: string | null;
  skipWinner?: boolean;
}) {
  const ids = gameData.players.map(p => p.id);
  const hasAtLeastOnePlayer = ids.length >= 1;

  const allScoresFinite =
    ids.length > 0 && ids.every(id => Number.isFinite(gameData.scores[id] ?? 0));

  const hasWinner = !!gameData.winner && ids.includes(gameData.winner!);

  // Base rule to advance: at least 1 player and all scores are valid.
  const baseValid = hasAtLeastOnePlayer && allScoresFinite;

  // Final proceed rule: either a winner is selected OR user confirmed skipping winner.
  const canProceed = baseValid && (hasWinner || gameData.skipWinner === true);

  return { hasAtLeastOnePlayer, allScoresFinite, hasWinner, canProceed };
}
