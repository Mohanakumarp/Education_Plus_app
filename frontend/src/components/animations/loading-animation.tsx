"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function LoadingAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const dots = container.querySelectorAll(".loading-dot");

    // Create a timeline for the loading animation
    const timeline = gsap.timeline({ repeat: -1 });

    // Elegant wave animation with staggered dots
    timeline.to(
      dots,
      {
        y: -8,
        duration: 0.6,
        stagger: {
          amount: 0.3,
          ease: "sine.inOut",
        },
      },
      0
    );

    timeline.to(
      dots,
      {
        y: 0,
        duration: 0.6,
        stagger: {
          amount: 0.3,
          ease: "sine.inOut",
        },
      },
      0.3
    );

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center justify-center gap-1.5 h-8">
      <div className="loading-dot w-2 h-2 rounded-full bg-indigo-600" />
      <div className="loading-dot w-2 h-2 rounded-full bg-indigo-600" />
      <div className="loading-dot w-2 h-2 rounded-full bg-indigo-600" />
    </div>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!spinnerRef.current) return;

    const spinner = spinnerRef.current;
    
    gsap.to(spinner, {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: "none",
    });

    return () => {
      gsap.killTweensOf(spinner);
    };
  }, []);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      ref={spinnerRef}
      className={`${sizeClasses[size]} rounded-full border-2 border-indigo-200 border-t-indigo-600`}
    />
  );
}

// Skeleton loader with shimmer effect
export function SkeletonLoader({ count = 3 }: { count?: number }) {
  const skeletonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!skeletonsRef.current) return;

    const skeletons = skeletonsRef.current.querySelectorAll(".skeleton");

    gsap.to(skeletons, {
      backgroundPosition: "200% center",
      duration: 1.5,
      repeat: -1,
      ease: "none",
    });

    return () => {
      gsap.killTweensOf(skeletons);
    };
  }, []);

  return (
    <div ref={skeletonsRef} className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-12 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
        />
      ))}
    </div>
  );
}
