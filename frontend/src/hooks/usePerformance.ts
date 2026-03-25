import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to manage loading states for async operations
 */
export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async <T,>(
    asyncFn: () => Promise<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { isLoading, error, execute, reset };
}

/**
 * Hook to track component render performance
 */
export function useRenderTime(componentName: string) {
  const [renderTime, setRenderTime] = useState<number | null>(null);

  // Log render time to console in development
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();

    return () => {
      const end = performance.now();
      const time = Math.round((end - start) * 100) / 100;
      setRenderTime(time);
      console.log(`📊 ${componentName} render time: ${time}ms`);
    };
  }

  return () => {};
}

/**
 * Hook to measure and track interaction latency
 */
export function useInteractionMetrics() {
  const measureInteraction = useCallback((label: string, fn: () => void | Promise<void>) => {
    const start = performance.now();

    Promise.resolve(fn()).then(() => {
      const end = performance.now();
      const duration = Math.round((end - start) * 100) / 100;

      if (duration > 100) {
        console.warn(`⚠️ Slow interaction "${label}": ${duration}ms`);
      } else {
        console.log(`✓ Interaction "${label}": ${duration}ms`);
      }
    });
  }, []);

  return { measureInteraction };
}

/**
 * Hook for lazy loading components with visibility
 */
export function useLazyLoad(ref: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isVisible;
}
