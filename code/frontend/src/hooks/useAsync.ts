import { useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseAsyncReturn<T, Args extends any[]> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook for handling async operations with loading and error states
 */
export function useAsync<T, Args extends any[] = []>(
  asyncFunction: (...args: Args) => Promise<T>
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = async (...args: Args): Promise<T | null> => {
    setState({ data: null, isLoading: true, error: null });

    try {
      const data = await asyncFunction(...args);
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, isLoading: false, error: errorMessage });
      return null;
    }
  };

  const reset = () => {
    setState({ data: null, isLoading: false, error: null });
  };

  return {
    ...state,
    execute,
    reset,
  };
}
