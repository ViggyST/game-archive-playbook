
import BrandingHeader from "@/components/BrandingHeader";
import ActionCards from "@/components/ActionCards";
import KiritoStatsCards from "@/components/KiritoStatsCards";
import KiritoInsightCards from "@/components/KiritoInsightCards";
import KiritoTriviaCarousel from "@/components/KiritoTriviaCarousel";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-muted/30 font-inter pb-safe">
      {/* Top Branding Section */}
      <BrandingHeader />
      
      {/* All-Time Stats Cards - Mobile optimized spacing */}
      <KiritoStatsCards />
      
      {/* Primary Action Cards - Mobile first design */}
      <ActionCards />
      
      {/* Game Insight Pills - Mobile scrollable */}
      <KiritoInsightCards />
      
      {/* Did You Know? Trivia Carousel - Mobile compact */}
      <KiritoTriviaCarousel />
    </div>
  );
};

export default Index;
