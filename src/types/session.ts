/**
 * Canonical types for session data across the application
 * All components should use these types for consistency
 */

export interface SessionPlayer {
  player_id: string;
  score_id: string;
  name: string;  // Canonical field name (not player_name)
  score: number;
  is_winner: boolean;
}

export interface SessionData {
  session_id: string;
  game_name: string;
  date: string;
  location: string;
  duration_minutes: number;
  highlights: string | null;
  players: SessionPlayer[];
  deleted_at?: string | null;
}

export interface CalendarSession {
  date: string;
  game_name: string;
  game_weight: string;
  session_id: string;
}

export interface GameSession {
  session_id: string;
  game_name: string;
  name: string;  // Canonical player name field
  player_id: string;
  score_id: string;
  score: number;
  is_winner: boolean;
  location: string;
  duration_minutes: number;
  highlights: string;
}