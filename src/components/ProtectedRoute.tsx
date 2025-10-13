import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { usePlayerContext } from '@/context/PlayerContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, player, isLoading } = usePlayerContext();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect if no session AND no legacy player
  if (!session && !player) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
