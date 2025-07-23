
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const BrandingHeader = () => {
  const [activePlayerName, setActivePlayerName] = useState("Kirito");
  const navigate = useNavigate();

  useEffect(() => {
    // Get the active player name from localStorage
    const storedPlayerName = localStorage.getItem('active_player_name');
    if (storedPlayerName) {
      setActivePlayerName(storedPlayerName);
    }
  }, []);

  const handleLogout = () => {
    // Clear the active player data from localStorage
    localStorage.removeItem('active_player');
    localStorage.removeItem('active_player_name');
    
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
          Hi {activePlayerName} <span className="animate-bounce-in inline-block">👋</span>
        </h2>
      </div>
    </div>
  );
};

export default BrandingHeader;
