
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Player {
  id: string;
  name: string;
}

interface PlayerContextType {
  player: Player | null;
  setPlayer: (player: Player | null) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [player, setPlayer] = useState<Player | null>(null);

  // Load player from localStorage on mount
  useEffect(() => {
    const activePlayerId = localStorage.getItem('active_player');
    const activePlayerName = localStorage.getItem('active_player_name');
    
    if (activePlayerId && activePlayerName) {
      setPlayer({ id: activePlayerId, name: activePlayerName });
    }
  }, []);

  // Save player to localStorage when it changes
  useEffect(() => {
    if (player) {
      localStorage.setItem('active_player', player.id);
      localStorage.setItem('active_player_name', player.name);
    } else {
      localStorage.removeItem('active_player');
      localStorage.removeItem('active_player_name');
    }
  }, [player]);

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
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
