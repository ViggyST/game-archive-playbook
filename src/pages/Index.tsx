
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerContext } from "@/context/PlayerContext";
import BrandingHeader from "@/components/BrandingHeader";
import ActionCards from "@/components/ActionCards";
import KiritoStatsCards from "@/components/KiritoStatsCards";
import KiritoInsightCards from "@/components/KiritoInsightCards";
import KiritoTriviaCarousel from "@/components/KiritoTriviaCarousel";

const Index = () => {
  const { player } = usePlayerContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!player) {
      navigate('/landing');
    }
  }, [player, navigate]);

  // Show loading while checking player status
  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-muted/30 font-inter">
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
