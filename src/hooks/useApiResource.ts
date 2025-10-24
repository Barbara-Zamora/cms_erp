import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api/client';

const cache = new Map<string, unknown>();

interface UseApiResourceOptions<T> {
  key: string;
  endpoint: string;
  params?: Record<string, string | number | boolean | undefined>;
  enabled?: boolean;
  initialData?: T;
}

export function useApiResource<T>({
  key,
  endpoint,
  params,
  enabled = true,
  initialData,
}: UseApiResourceOptions<T>) {
  const [data, setData] = useState<T | undefined>(() =>
    (cache.get(key) as T | undefined) ?? initialData,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!cache.has(key));

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    apiFetch<T>(endpoint, { params })
      .then((response) => {
        if (cancelled) return;
        cache.set(key, response);
        setData(response);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [key, endpoint, JSON.stringify(params), enabled]);

  const mutate = async (
    updater: (previous: T | undefined) => T,
    optimistic?: boolean,
  ) => {
    const previous = data;
    const nextValue = updater(previous);
    if (optimistic) {
      setData(nextValue);
      cache.set(key, nextValue);
    }
    return nextValue;
  };

  return { data, error, loading, setData, mutate } as const;
}

export function invalidateResource(key: string) {
  cache.delete(key);
}
