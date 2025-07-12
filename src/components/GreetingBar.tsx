
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, User } from "lucide-react";

interface GreetingBarProps {
  userName: string;
}

const GreetingBar = ({ userName }: GreetingBarProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-navy text-white">
          <AvatarFallback className="bg-navy text-white font-poppins font-medium">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex-1 text-center">
        <h1 className="font-poppins font-medium text-lg text-navy">
          Hi {userName} 👋
        </h1>
      </div>
      
      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <Settings className="h-6 w-6 text-navy" />
      </button>
    </div>
  );
};

export default GreetingBar;
