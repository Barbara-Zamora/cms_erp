import { Navigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading session…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
