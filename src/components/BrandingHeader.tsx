
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerContext } from "@/context/PlayerContext";

const BrandingHeader = () => {
  const { player, setPlayer } = usePlayerContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the player from context (this will also clear localStorage)
    setPlayer(null);
    
    // Redirect to landing page
    navigate('/landing');
  };

  return (
    <div className="px-4 pt-4 pb-2">
      {/* App Branding - Centered */}
      <div className="flex items-center justify-center mb-2 relative">
        <span className="text-2xl mr-2">🧩</span>
        <h1 className="font-poppins font-bold text-2xl text-navy">
          The Game Archive
        </h1>
        
        {/* Logout Button - Absolute positioned to top-right */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 text-navy hover:bg-orange-50 hover:text-orange-600"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Logout
        </Button>
      </div>
      
      {/* Personalized Greeting - Left aligned */}
      <div className="text-left">
        <h2 className="font-poppins text-xl font-semibold text-navy">
          Hi {player?.name || 'Player'} <span className="animate-bounce-in inline-block">👋</span>
        </h2>
      </div>
    </div>
  );
};

export default BrandingHeader;
