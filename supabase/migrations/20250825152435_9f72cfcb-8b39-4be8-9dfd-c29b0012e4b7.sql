-- Remove RLS policies and disable RLS
DROP POLICY IF EXISTS "Allow all operations on games" ON public.games;
DROP POLICY IF EXISTS "Allow all operations on players" ON public.players;
DROP POLICY IF EXISTS "Allow all operations on sessions" ON public.sessions;
DROP POLICY IF EXISTS "Allow all operations on scores" ON public.scores;
DROP POLICY IF EXISTS "Allow all operations on game_catalog" ON public.game_catalog;

-- Disable RLS on all tables
ALTER TABLE public.games DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.players DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_catalog DISABLE ROW LEVEL SECURITY;