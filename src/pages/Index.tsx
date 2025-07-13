
import GreetingBar from "@/components/GreetingBar";
import PlayerStatsCard from "@/components/PlayerStatsCard";
import ActionCards from "@/components/ActionCards";
import InsightsCarousel from "@/components/InsightsCarousel";
import MostPlayedGameCard from "@/components/MostPlayedGameCard";

const Index = () => {
  const userName = "Vignesh";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-muted/30 font-inter">
      {/* Top Greeting Bar */}
      <GreetingBar userName={userName} />
      
      {/* Player Stats Section */}
      <PlayerStatsCard playerName={userName} />
      
      {/* Most Played Game Card */}
      <MostPlayedGameCard />
      
      {/* Action Cards */}
      <ActionCards />
      
      {/* Fun Insights Carousel */}
      <InsightsCarousel playerName={userName} />
      
      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
};

export default Index;
