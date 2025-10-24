import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PropsWithChildren } from 'react';
import { apiFetch } from '../services/api/client';
import { Role, User } from '../types/models';
import { useNavigate } from 'react-router-dom';

interface AuthContextValue {
  user: User | null;
  role: Role | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ user: User; role: Role }>('/auth/me')
      .then((payload) => {
        setUser(payload.user);
        setRole(payload.role);
      })
      .catch(() => {
        setUser(null);
        setRole(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const result = await apiFetch<{ user: User; role: Role; accessToken: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
    );
    setUser(result.user);
    setRole(result.role);
    navigate('/admin');
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    navigate('/login');
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      login,
      logout,
      hasPermission: (permission: string) => role?.permissions.includes(permission) ?? false,
    }),
    [user, role, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('Auth context missing');
  return ctx;
}
