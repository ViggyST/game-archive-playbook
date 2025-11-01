import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePlayerContext } from "@/context/PlayerContext";
import { OTPInputModal } from "@/components/auth/OTPInputModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email");

const Landing = () => {
  // OTP state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  
  // Legacy login state
  const [playerName, setPlayerName] = useState("");
  const [isLoadingLegacy, setIsLoadingLegacy] = useState(false);
  const [showLegacyLogin, setShowLegacyLogin] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, player, isLoading, setPlayer } = usePlayerContext();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (!isLoading && (session || player)) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, player, isLoading, navigate]);

  // PWA-specific session restoration
  useEffect(() => {
    // Detect if running as PWA
    const isPWA = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isPWA && !isLoading) {
      console.log('[Landing] Running in PWA mode, checking for session...');
      console.log('[Landing] Display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser');
      console.log('[Landing] iOS standalone:', (window.navigator as any).standalone);
      
      // Check if we have a valid session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          console.log('[Landing] ✅ Valid session found in PWA, redirecting to dashboard');
          // Force full page navigation to ensure session is loaded
          window.location.href = '/dashboard';
        } else {
          console.log('[Landing] No session found in PWA storage');
        }
      });
    }
  }, [isLoading]);

  // Step 1: Request OTP
  const handleRequestOtp = async () => {
    // Validate email
    const result = emailSchema.safeParse(email.trim());
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return;
    }
    
    setEmailError("");
    setIsRequestingOtp(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true
        }
      });

      if (error) {
        toast({
          title: "Failed to send code",
          description: error.message,
          variant: "destructive",
        });
        setIsRequestingOtp(false);
        return;
      }

      // Success: show OTP modal
      toast({
        title: "✅ Code sent",
        description: "A 6-digit code has been sent to your email.",
      });

      setShowOtpModal(true);

    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "An error occurred",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (otp: string) => {
    setIsVerifyingOtp(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp,
        type: 'email'
      });

      if (error) {
        toast({
          title: "Invalid code",
          description: "Invalid or expired code. Please request a new one.",
          variant: "destructive",
        });
        setIsVerifyingOtp(false);
        return;
      }

      // OTP verified successfully - now do post-auth logic
      console.log('[OTP] Verification successful, checking player...');

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session found after OTP verification');
      }

      const authUid = session.user.id;

      // Look up player by auth_uid (same as before)
      const { data: existingPlayer, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .eq('auth_uid', authUid)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingPlayer) {
        // Existing player found - redirect to dashboard
        setPlayer(existingPlayer);
        toast({
          title: "Welcome back! 🎮",
          description: `Logged in as ${existingPlayer.name}`,
        });
        setShowOtpModal(false);
        window.location.href = '/dashboard';
      } else {
        // New player - redirect to registration
        toast({
          title: "Welcome! 👋",
          description: "Let's set up your profile.",
        });
        setShowOtpModal(false);
        window.location.href = '/register';
      }

    } catch (error: any) {
      console.error('[OTP] Verification error:', error);
      toast({
        title: "Verification failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      setIsVerifyingOtp(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true
        }
      });

      if (error) {
        toast({
          title: "Failed to resend",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Code resent! ✅",
        description: "Check your inbox again.",
      });
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast({
        title: "Failed to resend",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Legacy login handler
  const handleEnterArchive = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Please enter a player name",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingLegacy(true);
    console.log('Searching for player:', playerName.trim());

    try {
      // Search for player by name (case-insensitive)
      const { data: players, error } = await supabase
        .from('players')
        .select('*')
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
        setIsLoadingLegacy(false);
        return;
      }

      if (!players || players.length === 0) {
        toast({
          title: "Player not found",
          description: "This player is not recognised. Try again.",
          variant: "destructive",
        });
        setIsLoadingLegacy(false);
        return;
      }

      // Use the first matching player
      const player = players[0];
      console.log('Found player:', player);

      // Set the player in context
      setPlayer(player);

      console.log('Player set in context:', {
        id: player.id,
        name: player.name
      });

      // Navigate to the dashboard (not just "/")
      navigate("/dashboard");
    } catch (error) {
      console.error('Error searching for player:', error);
      toast({
        title: "An error occurred",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLegacy(false);
    }
  };


  const onboardingSlides = [
    {
      title: "Log Your Games",
      subtitle: "Record session dates, scores, and highlights",
      image: "/lovable-uploads/659589f2-c155-4b4c-b55a-072294c0b45a.png",
      bgColor: "bg-orange-50",
    },
    {
      title: "Track Your Stats", 
      subtitle: "View winrates, top scores, and recent matches",
      image: "/lovable-uploads/6fb51983-559b-4382-b6f2-542fa5f04807.png",
      bgColor: "bg-blue-50",
    },
    {
      title: "Manage Your Collection",
      subtitle: "Track your owned and wishlisted games",
      image: "/lovable-uploads/cd50cf35-90e1-4270-ac36-984cf3423aee.png",
      bgColor: "bg-yellow-50",
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F3] dark:bg-[#0F0F10] text-zinc-900 dark:text-zinc-100 transition-colors font-inter">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
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
          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Welcome to
          </h1>
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-brand dark:text-brand-hover mb-6">
            The Game Archive
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
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
                    <div className={`${slide.bgColor} dark:bg-zinc-900 rounded-2xl p-8 text-center h-80 flex flex-col justify-center items-center border border-zinc-200 dark:border-zinc-700`}>
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
                      <h3 className="text-xl font-poppins font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                        {slide.title}
                      </h3>
                      
                      {/* Subtitle */}
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-2">
              <div className="w-2 h-2 bg-brand rounded-full"></div>
              <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
              <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
            </div>
          </Carousel>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-poppins font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Hi Geek, who's playing today?
            </h3>
          </div>
          
          {/* OTP Login (Default) */}
          {!showLegacyLogin && (
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email ID"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  className={`w-full h-12 text-center text-lg border-2 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-brand focus:ring-brand dark:focus:border-brand-hover ${
                    emailError ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
                  }`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleRequestOtp();
                    }
                  }}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-2 text-center">{emailError}</p>
                )}
              </div>
              
              <Button
                onClick={handleRequestOtp}
                disabled={isRequestingOtp}
                className="w-full h-12 bg-brand hover:bg-brand-hover text-white font-semibold text-lg rounded-xl transition-colors"
              >
                {isRequestingOtp ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Continue with Email"
                )}
              </Button>

              {/* Legacy Login Toggle */}
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowLegacyLogin(true)}
                  className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 underline"
                >
                  Having trouble? Use legacy login
                </button>
              </div>
            </div>
          )}

          {/* Legacy Login (Hidden by default) */}
          {showLegacyLogin && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full h-12 text-center text-lg border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 rounded-xl focus:border-brand focus:ring-brand dark:focus:border-brand-hover"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleEnterArchive();
                  }
                }}
              />
              
              <Button
                onClick={handleEnterArchive}
                disabled={isLoadingLegacy}
                className="w-full h-12 bg-zinc-400 hover:bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-700 text-white font-semibold text-lg rounded-xl transition-colors"
              >
                {isLoadingLegacy ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  <>🎮 Enter Archive</>
                )}
              </Button>

              {/* Back to Email Login */}
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowLegacyLogin(false)}
                  className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 underline"
                >
                  ← Back to email login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* OTP Input Modal */}
        <OTPInputModal
          email={email}
          isOpen={showOtpModal}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          onClose={() => setShowOtpModal(false)}
          isVerifying={isVerifyingOtp}
        />
      </div>
    </div>
  );
};

export default Landing;
