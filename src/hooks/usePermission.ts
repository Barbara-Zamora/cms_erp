import { useAuth } from '../providers/AuthProvider';

export function usePermission(permission: string) {
  const { hasPermission, loading } = useAuth();
  return {
    allowed: hasPermission(permission),
    loading,
  };
}
