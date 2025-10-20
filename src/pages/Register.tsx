import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePlayerContext } from '@/context/PlayerContext';
import { z } from 'zod';
import { toast } from 'sonner';

// Validation schema
const playerNameSchema = z.string()
  .trim()
  .min(1, 'Player name is required')
  .max(50, 'Player name must be less than 50 characters');

export default function Register() {
  const navigate = useNavigate();
  const { session, player, setPlayer } = usePlayerContext();
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Access control: redirect if no session or player already exists
  useEffect(() => {
    if (!session) {
      navigate('/');
    } else if (player) {
      navigate('/dashboard');
    }
  }, [session, player, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    const result = playerNameSchema.safeParse(playerName);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert new player
      const { data: newPlayer, error: insertError } = await supabase
        .from('players')
        .insert({
          name: result.data,
          auth_uid: session!.user.id,
          avatar_url: null,
          username: null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Save to context
      setPlayer(newPlayer);
      
      toast.success('Welcome to The Game Archive! 🎮');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create player. Please try again.');
      toast.error('Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render form if access control checks haven't passed
  if (!session || player) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      {/* Blurred Background Layer */}
      <div className="fixed inset-0 z-0">
        {/* Same gradient as landing page */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50" />
        
        {/* Decorative icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl opacity-20">🎲</div>
          <div className="absolute top-20 right-16 text-3xl opacity-15">🃏</div>
          <div className="absolute top-40 left-20 text-2xl opacity-20">♟️</div>
          <div className="absolute bottom-40 right-10 text-4xl opacity-15">🎯</div>
          <div className="absolute bottom-20 left-16 text-3xl opacity-20">🧩</div>
          <div className="absolute top-60 right-32 text-2xl opacity-15">🎮</div>
        </div>
        
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-white/50" />
      </div>

      {/* Form Container */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome! 🎲</h1>
            <p className="text-base text-gray-500">
              Choose your player name to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="playerName" className="block text-sm font-semibold text-gray-700">
                Player Name
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                'Start Playing'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
