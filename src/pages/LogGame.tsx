
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import GameSessionInfoStep from "@/components/log-game/GameSessionInfoStep";
import CombinedPlayersScoresStepWrapper from "@/components/log-game/CombinedPlayersScoresStep";
import ReviewSubmitStep from "@/components/log-game/ReviewSubmitStep";
import { useLogGame } from "@/hooks/useLogGame";
import { evalStep2 } from "@/utils/validation";

export interface GameData {
  name: string;
  coverImage?: string;
  complexity?: 'Light' | 'Medium' | 'Heavy';
  date: Date;
  location: string;
  duration: number;
  players: Player[];
  scores: { [playerId: string]: number };
  winner?: string;
  highlights: string;
  skipWinner?: boolean;
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
    name: '',
    complexity: undefined,
    date: initialDate,
    location: '',
    duration: 90,
    players: [],
    scores: {},
    highlights: '',
    skipWinner: false
  });

  const steps = [
    { id: 1, title: "Game & Session Info", component: GameSessionInfoStep },
    { id: 2, title: "Players & Scores", component: CombinedPlayersScoresStepWrapper },
    { id: 3, title: "Review & Submit", component: ReviewSubmitStep }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const handleNext = () => {
    if (currentStep >= steps.length) return;
    
    // Special handling for step 2 (winner-optional flow)
    if (currentStep === 2) {
      const element = document.querySelector('[data-step-validation]');
      if (element && (element as any).handleNextClick) {
        const shouldProceed = (element as any).handleNextClick();
        if (shouldProceed) {
          setCurrentStep(currentStep + 1);
        }
        return;
      }
      
      // Fallback logic if element not found
      const { hasAtLeastOnePlayer, allScoresFinite, hasWinner } = evalStep2(gameData);
      if (hasAtLeastOnePlayer && allScoresFinite && hasWinner) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  // Function to proceed to next step (exposed for modal confirmation)
  const proceedToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Expose proceedToNextStep to child components
  React.useEffect(() => {
    const element = document.querySelector('[data-log-game]');
    if (element) {
      (element as any).proceedToNextStep = proceedToNextStep;
    }
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async () => {
    console.log("Attempting to save game:", gameData);
    console.log("Players:", gameData.players);
    console.log("Scores object:", gameData.scores);
    console.log("Winner ID:", gameData.winner);
    
    // Validate that we have all required data
    if (gameData.players.length === 0) {
      console.error("No players found");
      return;
    }
    
    if (Object.keys(gameData.scores).length === 0) {
      console.error("No scores found");
      return;
    }
    
    try {
      await logGameMutation.mutateAsync(gameData);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      // Error handling is done in the hook via toast
    }
  };

  const updateGameData = (updates: Partial<GameData & { skipWinner?: boolean }>) => {
    setGameData(prev => ({ 
      ...prev, 
      ...updates,
      // Clear skipWinner when going back to step 2
      ...(currentStep === 2 && updates.skipWinner === undefined ? { skipWinner: false } : {})
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          gameData.name.trim() !== '' &&
          gameData.complexity !== undefined &&
          gameData.location.trim() !== '' &&
          gameData.duration > 0
        );
      case 2: {
        // For step 2, enable Next when baseValid (players + scores), winner is optional
        const { hasAtLeastOnePlayer, allScoresFinite } = evalStep2(gameData);
        return hasAtLeastOnePlayer && allScoresFinite;
      }
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
            
            <div className="w-10" /> {/* Spacer for balance */}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-sky-blue-500 to-[var(--brand)] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="animate-fade-in" data-log-game>
        {CurrentStepComponent && (
          <CurrentStepComponent 
            gameData={gameData}
            updateGameData={updateGameData}
          />
        )}
      </div>

      {/* Footer Navigation */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-6">
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 font-inter"
            disabled={logGameMutation.isPending}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || logGameMutation.isPending}
              className="flex-1 bg-gradient-to-r from-sky-blue-500 to-[var(--brand)] text-white font-inter hover:opacity-90"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || logGameMutation.isPending}
              className="flex-1 bg-gradient-to-r from-[var(--brand)] to-sky-blue-500 text-white font-inter hover:opacity-90"
            >
              {logGameMutation.isPending ? 'Saving...' : 'Save Game'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogGame;
