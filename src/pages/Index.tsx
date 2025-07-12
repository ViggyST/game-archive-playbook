
import GreetingBar from "@/components/GreetingBar";
import PlayerStatsCard from "@/components/PlayerStatsCard";
import ActionCards from "@/components/ActionCards";
import InsightsCarousel from "@/components/InsightsCarousel";

const Index = () => {
  // Real stats based on knowledge base data (10 games, Vignesh won 6)
  const playerStats = {
    gamesPlayed: 10,
    gamesWon: 6,
    winRate: 60
  };

  const userName = "Vignesh";

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Top Greeting Bar */}
      <GreetingBar userName={userName} />
      
      {/* Player Stats Section */}
      <PlayerStatsCard stats={playerStats} />
      
      {/* Action Cards */}
      <ActionCards />
      
      {/* Fun Insights Carousel */}
      <InsightsCarousel />
      
      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
};

export default Index;
