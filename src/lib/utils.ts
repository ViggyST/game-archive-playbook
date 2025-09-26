import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get current date in IST timezone as YYYY-MM-DD string
 * Used for filtering out future dates in queries
 */
export function getCurrentDateIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split('T')[0];
}

/**
 * Apply consistent soft-delete filtering to Supabase queries
 * @param query - The Supabase query builder
 * @param options - Filtering options
 */
export function applySoftDeleteFilters(
  query: any, 
  options: {
    sessions?: boolean;
    scores?: boolean;
    includeDateLimit?: boolean;
  } = { sessions: true, scores: true }
) {
  let filteredQuery = query;
  
  // Filter deleted sessions
  if (options.sessions) {
    filteredQuery = filteredQuery.is('deleted_at', null);
  }
  
  // Filter deleted scores (nested relation)
  if (options.scores) {
    filteredQuery = filteredQuery.is('scores.deleted_at', null);
  }
  
  // Filter future dates (IST timezone)
  if (options.includeDateLimit) {
    filteredQuery = filteredQuery.lte('date', getCurrentDateIST());
  }
  
  return filteredQuery;
}
