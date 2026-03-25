/**
 * Performance Monitoring Utilities
 * Helps measure Core Web Vitals and custom metrics
 */

// Core Web Vitals measurement
export interface WebVitals {
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  INP?: number; // Interaction to Next Paint
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  FCP?: number; // First Contentful Paint
}

/**
 * Measure Core Web Vitals using Web Vitals library
 * Install: npm install web-vitals
 */
export async function measureCoreWebVitals(): Promise<WebVitals> {
  if (typeof window === "undefined") return {};

  try {
    const { getCLS, getFID, getLCP, getFCP } = await import("web-vitals");

    const metrics: WebVitals = {};

    getCLS((metric) => {
      metrics.CLS = metric.value;
    });

    getFID((metric) => {
      metrics.FID = metric.value;
    });

    getLCP((metric) => {
      metrics.LCP = metric.value;
    });

    getFCP((metric) => {
      metrics.FCP = metric.value;
    });

    return metrics;
  } catch {
    console.warn("web-vitals library not installed");
    return {};
  }
}

/**
 * Measure performance using Performance API
 */
export function measurePageLoad(): {
  dns: number;
  tcp: number;
  ttfb: number;
  fcp: number;
  lcp: number;
  tti: number;
  total: number;
} {
  if (typeof window === "undefined") {
    return { dns: 0, tcp: 0, ttfb: 0, fcp: 0, lcp: 0, tti: 0, total: 0 };
  }

  const perfData = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

  if (!perfData) {
    return { dns: 0, tcp: 0, ttfb: 0, fcp: 0, lcp: 0, tti: 0, total: 0 };
  }

  return {
    dns: perfData.domainLookupEnd - perfData.domainLookupStart,
    tcp: perfData.connectEnd - perfData.connectStart,
    ttfb: perfData.responseStart - perfData.requestStart,
    fcp: perfData.responseEnd - perfData.responseStart,
    lcp: perfData.loadEventEnd - perfData.loadEventStart,
    tti: perfData.domInteractive - perfData.fetchStart,
    total: perfData.loadEventEnd - perfData.fetchStart,
  };
}

/**
 * Log performance metrics
 */
export function logPerformanceMetrics(label?: string): void {
  if (typeof window === "undefined") return;

  const metrics = measurePageLoad();

  console.group(`⚡ Performance Metrics ${label ? `- ${label}` : ""}`);
  console.log(`DNS Lookup: ${metrics.dns}ms`);
  console.log(`TCP Connection: ${metrics.tcp}ms`);
  console.log(`Time to First Byte: ${metrics.ttfb}ms`);
  console.log(`First Contentful Paint: ${metrics.fcp}ms`);
  console.log(`Time to Interactive: ${metrics.tti}ms`);
  console.log(`Total Load Time: ${metrics.total}ms`);
  console.groupEnd();
}

/**
 * Measure component render time
 */
export function measureComponentRender(
  componentName: string,
  renderFn: () => void
): number {
  const start = performance.now();
  renderFn();
  const end = performance.now();

  const duration = end - start;
  console.log(`✓ ${componentName} rendered in ${duration.toFixed(2)}ms`);

  return duration;
}

/**
 * Track memory usage (if available)
 */
export function getMemoryUsage(): {
  jsHeapSize: number;
  jsHeapSizeLimit: number;
  usedPercentage: number;
} | null {
  if (
    typeof performance !== "undefined" &&
    (performance as any).memory
  ) {
    const memory = (performance as any).memory;
    return {
      jsHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // MB
      jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      usedPercentage: Math.round(
        (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      ),
    };
  }

  return null;
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP(): Promise<number> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
      resolve(0);
      return;
    }

    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as any[];
        const lastEntry = entries[entries.length - 1];
        observer.disconnect();
        resolve(lastEntry.renderTime || lastEntry.loadTime);
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });

      // Timeout after 5 seconds if LCP not detected
      setTimeout(() => {
        observer.disconnect();
        resolve(0);
      }, 5000);
    } catch {
      resolve(0);
    }
  });
}

/**
 * Detect slow page transitions
 */
export function measurePageTransition(
  fromPath: string,
  toPath: string,
  duration: number
): void {
  const threshold = 500; // milliseconds

  if (duration > threshold) {
    console.warn(
      `⚠️ Slow page transition detected: ${fromPath} → ${toPath} (${duration}ms)`
    );
  } else {
    console.log(
      `✓ Page transition: ${fromPath} → ${toPath} (${duration}ms)`
    );
  }
}

/**
 * Get bundle size estimate (for development)
 */
export function estimateBundleSize(): void {
  if (typeof document === "undefined") return;

  const scripts = Array.from(document.querySelectorAll("script"));
  let totalSize = 0;

  scripts.forEach((script) => {
    if (script.src) {
      // This is an estimate; actual size would come from headers
      console.log(`Script: ${script.src}`);
    }
  });

  console.log(`Scripts loaded: ${scripts.length}`);
}
