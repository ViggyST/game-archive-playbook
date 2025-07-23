
import { useState, useEffect } from "react";

const BrandingHeader = () => {
  const [activePlayerName, setActivePlayerName] = useState("Kirito");

  useEffect(() => {
    // Get the active player name from localStorage
    const storedPlayerName = localStorage.getItem('active_player_name');
    if (storedPlayerName) {
      setActivePlayerName(storedPlayerName);
    }
  }, []);

  return (
    <div className="px-4 pt-4 pb-2">
      {/* App Branding - Centered */}
      <div className="flex items-center justify-center mb-2">
        <span className="text-2xl mr-2">🧩</span>
        <h1 className="font-poppins font-bold text-2xl text-navy">
          The Game Archive
        </h1>
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
