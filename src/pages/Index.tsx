
import { usePlayerContext } from "@/context/PlayerContext";
import BrandingHeader from "@/components/BrandingHeader";
import ActionCards from "@/components/ActionCards";
import KiritoStatsCards from "@/components/KiritoStatsCards";
import KiritoInsightCards from "@/components/KiritoInsightCards";
import KiritoTriviaCarousel from "@/components/KiritoTriviaCarousel";

const Index = () => {
  const { player } = usePlayerContext();

  return (
    <div className="min-h-screen bg-[var(--bg)] transition-colors font-inter">
      {/* Top Branding Section */}
      <BrandingHeader />
      
      {/* All-Time Stats Cards - Elevated Glass Style */}
      <KiritoStatsCards />
      
      {/* Primary Action Cards - Prominent CTA placement */}
      <ActionCards />
      
      {/* Game Insight Pills - Horizontal scroll below CTAs */}
      <KiritoInsightCards />
      
      {/* Did You Know? Trivia Carousel - Compact bottom section */}
      <KiritoTriviaCarousel />
    </div>
  );
};

export default Index;
