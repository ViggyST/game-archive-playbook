import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePlayerContext } from '@/context/PlayerContext';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setPlayer } = usePlayerContext();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      console.log('[AuthCallback] Magic link detected, waiting for Supabase to process...');
      console.log('[AuthCallback] URL hash:', window.location.hash);
      
      // Supabase automatically processes magic link tokens in the URL hash
      // We just need to wait a moment for it to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if we now have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('[AuthCallback] Session error:', sessionError);
        throw sessionError;
      }
      
      if (!session) {
        throw new Error('No session found. The magic link may have expired or already been used.');
      }

      console.log('[AuthCallback] Session retrieved for user:', session.user.id);

      const authUid = session.user.id;

      // Look up player by auth_uid
      const { data: existingPlayer, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .eq('auth_uid', authUid)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingPlayer) {
        // Existing player found
        setPlayer(existingPlayer);
        setStatus('success');
        toast.success('Welcome back!');
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        // New user → redirect to registration
        setStatus('success');
        toast.info('Let\'s set up your profile!');
        setTimeout(() => navigate('/register'), 500);
      }
    } catch (error: any) {
      console.error('[AuthCallback] Error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Authentication failed. The link may have expired.');
      toast.error('Authentication failed');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-foreground">Verifying your login...</h2>
          <p className="text-muted-foreground">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h2 className="text-xl font-semibold text-foreground">Login successful!</h2>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl">❌</div>
        <h2 className="text-xl font-semibold text-foreground">Authentication Failed</h2>
        <p className="text-muted-foreground">{errorMessage}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

