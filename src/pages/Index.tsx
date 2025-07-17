
import BrandingHeader from "@/components/BrandingHeader";
import ActionCards from "@/components/ActionCards";
import KiritoStatsCards from "@/components/KiritoStatsCards";
import KiritoInsightCards from "@/components/KiritoInsightCards";
import KiritoTriviaCarousel from "@/components/KiritoTriviaCarousel";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-muted/30 font-inter">
      {/* Top Branding Section */}
      <BrandingHeader />
      
      {/* Personalized Greeting */}
      <div className="px-4 pt-2 pb-3">
        <h2 className="font-poppins text-xl font-semibold text-navy text-left">
          Hi Kirito <span className="animate-bounce-in inline-block">👋</span>
        </h2>
      </div>
      
      {/* All-Time Stats Cards */}
      <KiritoStatsCards />
      
      {/* Game Insight Cards */}
      <KiritoInsightCards />
      
      {/* Primary Action Cards */}
      <ActionCards />
      
      {/* Did You Know? Trivia Carousel */}
      <KiritoTriviaCarousel />
      
      {/* Bottom spacing */}
      <div className="h-4"></div>
    </div>
  );
};

export default Index;
