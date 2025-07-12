
import GreetingBar from "@/components/GreetingBar";
import PlayerStatsCard from "@/components/PlayerStatsCard";
import ActionCards from "@/components/ActionCards";
import InsightsCarousel from "@/components/InsightsCarousel";

const Index = () => {
  // Mock data - in a real app, this would come from your data store
  const playerStats = {
    gamesPlayed: 42,
    gamesWon: 28,
    winRate: 67
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
