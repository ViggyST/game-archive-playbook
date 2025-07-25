
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePlayerContext } from "@/context/PlayerContext";

const Landing = () => {
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setPlayer } = usePlayerContext();

  const handleEnterArchive = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Please enter a player name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Searching for player:', playerName.trim());

    try {
      // Search for player by name (case-insensitive)
      const { data: players, error } = await supabase
        .from('players')
        .select('id, name')
        .ilike('name', playerName.trim());

      console.log('Search results:', players);
      console.log('Search error:', error);

      if (error) {
        console.error('Database error:', error);
        toast({
          title: "Database error",
          description: "Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!players || players.length === 0) {
        toast({
          title: "Player not found",
          description: "This player is not recognised. Try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Use the first matching player
      const player = players[0];
      console.log('Found player:', player);

      // Set the player in context
      setPlayer({ id: player.id, name: player.name });

      console.log('Player set in context:', {
        id: player.id,
        name: player.name
      });

      // Navigate to the main app
      navigate("/");
    } catch (error) {
      console.error('Error searching for player:', error);
      toast({
        title: "An error occurred",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onboardingSlides = [
    {
      title: "Log Your Games",
      subtitle: "Record session date, duration, location, and highlights",
      image: "/lovable-uploads/659589f2-c155-4b4c-b55a-072294c0b45a.png",
      bgColor: "bg-orange-50",
    },
    {
      title: "Track Your Stats", 
      subtitle: "See winrates, top scores, and recent matches",
      image: "/lovable-uploads/6fb51983-559b-4382-b6f2-542fa5f04807.png",
      bgColor: "bg-blue-50",
    },
    {
      title: "Play Leaderboards",
      subtitle: "Compare with friends and climb rankings",
      image: "/lovable-uploads/d2994d75-f847-4b5d-bfcb-72cb28b8efe0.png",
      bgColor: "bg-yellow-50",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 font-inter">
      {/* Background Decorative Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl opacity-20">🎲</div>
        <div className="absolute top-20 right-16 text-3xl opacity-15">🃏</div>
        <div className="absolute top-40 left-20 text-2xl opacity-20">♟️</div>
        <div className="absolute bottom-40 right-10 text-4xl opacity-15">🎯</div>
        <div className="absolute bottom-20 left-16 text-3xl opacity-20">🧩</div>
        <div className="absolute top-60 right-32 text-2xl opacity-15">🎮</div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Top Branding Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 mb-4">
            Welcome to
          </h1>
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-orange-500 mb-6">
            The Game Archive
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your personal board game companion for logging sessions, tracking stats, and competing with friends
          </p>
        </div>

        {/* Onboarding Carousel */}
        <div className="w-full max-w-4xl mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              {onboardingSlides.map((slide, index) => (
                <CarouselItem key={index} className="md:basis-1/3">
                  <div className="p-4">
                    <div className={`${slide.bgColor} rounded-2xl p-8 text-center h-80 flex flex-col justify-center items-center border border-gray-100`}>
                      {/* Image */}
                      <div className="mb-6">
                        <div className="w-32 h-32 flex items-center justify-center mb-4">
                          <img 
                            src={slide.image} 
                            alt={slide.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-poppins font-bold text-gray-900 mb-3">
                        {slide.title}
                      </h3>
                      
                      {/* Subtitle */}
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </Carousel>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-poppins font-semibold text-gray-900 mb-2">
              Hi Geek, who's playing today?
            </h3>
          </div>
          
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full h-12 text-center text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleEnterArchive();
                }
              }}
            />
            
            <Button
              onClick={handleEnterArchive}
              disabled={isLoading}
              className="w-full h-12 bg-gray-400 hover:bg-gray-500 text-white font-semibold text-lg rounded-xl transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                <>🎮 Enter Archive</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
