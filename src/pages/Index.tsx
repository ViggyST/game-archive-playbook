
import BrandingHeader from "@/components/BrandingHeader";
import EnhancedPlayerStats from "@/components/EnhancedPlayerStats";
import ActionCards from "@/components/ActionCards";
import EnhancedInsights from "@/components/EnhancedInsights";

const Index = () => {
  const userName = "Vignesh";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-muted/30 font-inter">
      {/* Top Branding Section */}
      <BrandingHeader />
      
      {/* Your Stats Section */}
      <EnhancedPlayerStats playerName={userName} />
      
      {/* Action Cards */}
      <ActionCards />
      
      {/* Did You Know? Insights */}
      <EnhancedInsights playerName={userName} />
      
      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
};

export default Index;
