import { Database } from './supabase';

// Row types (for SELECT queries)
export type PlayerRow = Database['public']['Tables']['players']['Row'];
export type GameRow = Database['public']['Tables']['games']['Row'];
export type SessionRow = Database['public']['Tables']['sessions']['Row'];
export type ScoreRow = Database['public']['Tables']['scores']['Row'];
export type CollectionRow = Database['public']['Tables']['collections']['Row'];
export type TagRow = Database['public']['Tables']['tags']['Row'];
export type GameCatalogRow = Database['public']['Tables']['game_catalog']['Row'];

// Insert types (for INSERT operations)
export type InsertPlayer = Database['public']['Tables']['players']['Insert'];
export type InsertGame = Database['public']['Tables']['games']['Insert'];
export type InsertSession = Database['public']['Tables']['sessions']['Insert'];
export type InsertScore = Database['public']['Tables']['scores']['Insert'];

// Update types (for UPDATE operations)
export type UpdatePlayer = Database['public']['Tables']['players']['Update'];
export type UpdateGame = Database['public']['Tables']['games']['Update'];
export type UpdateSession = Database['public']['Tables']['sessions']['Update'];
export type UpdateScore = Database['public']['Tables']['scores']['Update'];

// Re-export Database for advanced use cases
export type { Database };
