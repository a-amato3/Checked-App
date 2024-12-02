import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (err: any) {
      const message = err
        ? err.message 
        : 'An unexpected error occurred';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw err;
    }
  }, []);

  return { ...state, execute };
} 