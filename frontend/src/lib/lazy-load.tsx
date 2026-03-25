import { lazy, Suspense, ReactNode } from 'react';
import { ChartSkeleton } from '@/components/skeletons';

/**
 * Wraps a component with lazy loading and Suspense boundary
 * @param importFunc - Dynamic import of component
 * @param fallback - Loading fallback UI
 */
export function withLazyLoad<P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFunc);

  return function LazyLoadedComponent(props: P) {
    return (
      <Suspense fallback={fallback || <ChartSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Batch lazy loads multiple component sections
 * Useful for pages with multiple lazy-loaded sections
 */
export function createLazyLoadedPage(sections: {
  [key: string]: {
    component: () => Promise<{ default: React.ComponentType<any> }>;
    props?: any;
    fallback?: ReactNode;
  };
}) {
  const loadedSections: { [key: string]: React.ComponentType<any> } = {};

  Object.entries(sections).forEach(([key, { component }]) => {
    loadedSections[key] = lazy(component);
  });

  return loadedSections;
}
