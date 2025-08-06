
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogGameStep1 from "@/components/log-game/LogGameStep1";
import LogGameStep2 from "@/components/log-game/LogGameStep2";
import LogGameSummary from "@/components/log-game/LogGameSummary";
import { useLogGame } from "@/hooks/useLogGame";

export interface GameData {
  name: string;
  complexity: 'Light' | 'Medium' | 'Heavy';
  date: Date;
  location: string;
  duration: number;
  players: Player[];
  scores: { [playerId: string]: number };
  winner?: string;
  highlights: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
}

const LogGame = () => {
  const navigate = useNavigate();
  const logGameMutation = useLogGame();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Initialize with date set to noon to avoid timezone issues
  const today = new Date();
  const initialDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
  
  const [gameData, setGameData] = useState<GameData>({
    name: 'Wingspan', // Default for testing - can be from route params later
    complexity: 'Medium',
    date: initialDate,
    location: '',
    duration: 90,
    players: [],
    scores: {},
    highlights: ''
  });

  const steps = [
    { id: 1, title: "Game & Session Details", component: LogGameStep1 },
    { id: 2, title: "Players, Scores & Highlights", component: LogGameStep2 },
    { id: 3, title: "Review & Submit", component: LogGameSummary }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async () => {
    console.log("Attempting to save game:", gameData);
    
    try {
      await logGameMutation.mutateAsync(gameData);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const updateGameData = (updates: Partial<GameData>) => {
    setGameData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return gameData.name.trim() !== '' && gameData.location.trim() !== '';
      case 2:
        return gameData.players.length >= 2 && 
               Object.keys(gameData.scores).length === gameData.players.length &&
               gameData.winner;
      case 3:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBack}
              className="hover:bg-navy/10"
              disabled={logGameMutation.isPending}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="font-poppins font-semibold text-lg text-navy">
                {currentStepData?.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </p>
            </div>
            
            <div className="w-10" />
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-sky-blue-500 to-meeple-gold-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="px-6 py-6 animate-fade-in">
        {CurrentStepComponent && (
          <CurrentStepComponent 
            gameData={gameData}
            updateGameData={updateGameData}
            onNext={handleNext}
            onSubmit={handleSubmit}
            canProceed={canProceed()}
            isPending={logGameMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

export default LogGame;
