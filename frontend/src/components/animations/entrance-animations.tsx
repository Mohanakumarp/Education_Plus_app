"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";

interface EntranceAnimationProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}

/**
 * Gentle fade-in animation when component mounts
 */
export function FadeInAnimation({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
}: EntranceAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.fromTo(
      elementRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration,
        delay,
        ease: "power2.out",
      }
    );
  }, [delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Slide-in from bottom with fade animation
 */
export function SlideUpAnimation({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
}: EntranceAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.fromTo(
      elementRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power2.out",
      }
    );
  }, [delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Staggered entrance animation for list items
 */
export function StaggeredEntranceAnimation({
  children,
  delay = 0,
  duration = 0.6,
  stagger = 0.08,
  className = "",
}: EntranceAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.children;

    gsap.fromTo(
      items,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger: stagger,
        ease: "power2.out",
      }
    );
  }, [delay, duration, stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Scale entrance animation (subtle grow effect)
 */
export function ScaleInAnimation({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
}: EntranceAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.fromTo(
      elementRef.current,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration,
        delay,
        ease: "power2.out",
      }
    );
  }, [delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Number counter animation (counts up to target value)
 */
export function CountUpAnimation({
  target,
  duration = 1.5,
  delay = 0,
  format = (val: number) => Math.round(val).toString(),
}: {
  target: number;
  duration?: number;
  delay?: number;
  format?: (val: number) => string;
}) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const obj = { value: 0 };

    gsap.to(obj, {
      value: target,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        if (elementRef.current) {
          elementRef.current.textContent = format(obj.value);
        }
      },
    });

    return () => {
      gsap.killTweensOf(obj);
    };
  }, [target, duration, delay, format]);

  return <div ref={elementRef} />;
}

/**
 * Pulse animation for attention-grabbing (subtle)
 */
export function PulseAnimation({
  children,
  duration = 2,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.to(elementRef.current, {
      opacity: 0.7,
      duration: duration / 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, [duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
