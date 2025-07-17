
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
      <div className="px-4 pb-2">
        <h2 className="font-poppins text-xl font-semibold text-navy text-center">
          Hi Kirito <span className="animate-bounce-in inline-block">👋</span>
        </h2>
      </div>
      
      {/* All-Time Stats Cards */}
      <KiritoStatsCards />
      
      {/* Primary Action Cards - More prominent placement */}
      <div className="mt-3 mb-3">
        <ActionCards />
      </div>
      
      {/* Game Insight Cards */}
      <KiritoInsightCards />
      
      {/* Did You Know? Trivia Carousel */}
      <KiritoTriviaCarousel />
    </div>
  );
};

export default Index;
