
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerContext } from "@/context/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const BrandingHeader = () => {
  const { player, logout } = usePlayerContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out successfully",
      description: "See you next time! 👋",
    });
    navigate('/');
  };

  return (
    <div className="px-4 pt-4 pb-2">
      {/* App Branding - Centered */}
      <div className="flex items-center justify-center mb-2 relative">
        <span className="text-2xl mr-2">🧩</span>
        <h1 className="font-poppins font-bold text-2xl text-zinc-900 dark:text-zinc-100">
          The Game Archive
        </h1>
        
        {/* Right side controls */}
        <div className="absolute right-0 top-0 flex items-center gap-2">
          <ThemeToggle />
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-zinc-900 dark:text-zinc-100 hover:bg-brand/10 hover:text-brand"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Personalized Greeting - Left aligned */}
      <div className="text-left">
        <h2 className="font-poppins text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Hi {player?.name || 'Player'} <span className="animate-bounce-in inline-block">👋</span>
        </h2>
      </div>
    </div>
  );
};

export default BrandingHeader;
