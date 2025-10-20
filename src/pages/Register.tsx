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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome! 🎲</h1>
            <p className="text-muted-foreground">
              Choose your player name to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="playerName" className="text-sm font-medium">
                Player Name
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Start Playing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
