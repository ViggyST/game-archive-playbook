
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { PlayerRow } from '@/types/database';

interface PlayerContextType {
  player: PlayerRow | null;
  session: Session | null;
  isLoading: boolean;
  setPlayer: (player: PlayerRow | null) => void;
  logout: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [player, setPlayer] = useState<PlayerRow | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to load player from auth_uid
  const loadPlayerFromAuth = async (authUid: string) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('id, name, avatar_url, username, auth_uid, created_at, deleted_at')
        .eq('auth_uid', authUid)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setPlayer(data);
        // Sync to localStorage for backward compatibility
        localStorage.setItem('active_player', data.id);
        localStorage.setItem('active_player_name', data.name);
      }
    } catch (error) {
      console.error('Error loading player from auth:', error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setPlayer(null);
      localStorage.removeItem('active_player');
      localStorage.removeItem('active_player_name');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Initialize auth on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        console.log('[Auth] Starting session initialization...');
        
        // Check for active Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('[Auth] getSession() resolved:', session ? 'Session found' : 'No session');
        
        if (!isMounted) return;

        if (session?.user) {
          // Auth session exists → load player by auth_uid
          console.log('[Auth] Valid session found, loading player for auth_uid:', session.user.id);
          setSession(session);
          await loadPlayerFromAuth(session.user.id);
          console.log('[Auth] Player loaded successfully');
        } else {
          // No session → clear any stale tokens and check legacy localStorage
          console.log('[Auth] No valid session, clearing stale tokens...');
          await supabase.auth.signOut();
          
          const activePlayerId = localStorage.getItem('active_player');
          const activePlayerName = localStorage.getItem('active_player_name');
          
          if (activePlayerId && activePlayerName) {
            console.log('[Auth] Using legacy localStorage fallback');
            setPlayer({ 
              id: activePlayerId, 
              name: activePlayerName,
              avatar_url: null,
              created_at: null,
              deleted_at: null,
              auth_uid: null,
              username: null
            });
          } else {
            console.log('[Auth] No legacy player found');
          }
        }
      } catch (error) {
        console.error('[Auth] Initialization error:', error);
      } finally {
        if (isMounted) {
          console.log('[Auth] Initialization complete, setting isLoading = false');
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes (login/logout)
    // CRITICAL: Callback must be synchronous to prevent Supabase deadlock
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[Auth] Event received:', event);
        
        // Synchronous state updates
        setSession(session);
        
        if (session?.user) {
          // Defer async work to prevent blocking Supabase's event loop
          setTimeout(() => {
            console.log('[Auth] Loading player after auth change...');
            loadPlayerFromAuth(session.user.id);
          }, 0);
        } else {
          setPlayer(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Save player to localStorage when it changes (legacy mode only)
  useEffect(() => {
    // Only sync if no session (legacy mode)
    if (!session) {
      if (player) {
        localStorage.setItem('active_player', player.id);
        localStorage.setItem('active_player_name', player.name);
      } else {
        localStorage.removeItem('active_player');
        localStorage.removeItem('active_player_name');
      }
    }
  }, [player, session]);

  return (
    <PlayerContext.Provider value={{ player, session, isLoading, setPlayer, logout }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};
