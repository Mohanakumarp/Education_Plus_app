"use client";

import { ReactNode, useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * Button micro-interaction handler
 * Adds click feedback animation
 */
export function useButtonAnimation(duration = 0.2) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;

    const handleClick = () => {
      gsap.to(button, {
        scale: 0.95,
        duration: duration / 2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    };

    button.addEventListener("click", handleClick);

    return () => {
      button.removeEventListener("click", handleClick);
    };
  }, [duration]);

  return buttonRef;
}

/**
 * Smooth collapse/expand animation for accordions
 */
export function useCollapseAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const content = container.querySelector("[data-collapsible-content]");

    if (!content) return;

    // Store original content
    const originalHeight = (content as HTMLElement).scrollHeight;

    return () => {
      gsap.killTweensOf(content);
    };
  }, []);

  const toggle = (isOpen: boolean) => {
    const content = containerRef.current?.querySelector(
      "[data-collapsible-content]"
    ) as HTMLElement;
    if (!content) return;

    gsap.to(content, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return { containerRef, toggle };
}

/**
 * Form field focus animation
 */
export function useFormFieldAnimation() {
  const fieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!fieldRef.current) return;

    const field = fieldRef.current;
    const parent = field.parentElement;

    const handleFocus = () => {
      gsap.to(parent, {
        boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1), 0 0 0 1px rgba(79, 70, 229, 0.3)",
        duration: 0.2,
      });
    };

    const handleBlur = () => {
      gsap.to(parent, {
        boxShadow: "0 0 0 0px rgba(79, 70, 229, 0)",
        duration: 0.2,
      });
    };

    field.addEventListener("focus", handleFocus);
    field.addEventListener("blur", handleBlur);

    return () => {
      field.removeEventListener("focus", handleFocus);
      field.removeEventListener("blur", handleBlur);
    };
  }, []);

  return fieldRef;
}

/**
 * Shake animation for error states
 */
export function useShakeAnimation() {
  const elementRef = useRef<HTMLDivElement>(null);

  const shake = () => {
    if (!elementRef.current) return;

    gsap.to(elementRef.current, {
      x: -10,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power1.out",
    });
  };

  return { elementRef, shake };
}

/**
 * Slide down animation for notifications/alerts
 */
export function useSlideDownAnimation(isOpen: boolean) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.to(elementRef.current, {
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : -20,
      duration: 0.3,
      ease: "power2.out",
      pointerEvents: isOpen ? "auto" : "none",
    });
  }, [isOpen]);

  return elementRef;
}

/**
 * Smooth height transition (for content reveal/hide)
 */
export function useSmoothHeightAnimation(isOpen: boolean) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const scrollHeight = element.scrollHeight;

    gsap.to(element, {
      height: isOpen ? scrollHeight : 0,
      opacity: isOpen ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => {
        if (isOpen) {
          element.style.height = "auto";
        }
      },
    });
  }, [isOpen]);

  return elementRef;
}

/**
 * Success checkmark animation
 */
export function SuccessCheckmark({
  show,
  size = 24,
}: {
  show: boolean;
  size?: number;
}) {
  const checkRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!checkRef.current || !circleRef.current) return;

    if (show) {
      const timeline = gsap.timeline();

      timeline.to(circleRef.current, {
        r: size / 2,
        duration: 0.3,
        ease: "back.out",
      });

      timeline.fromTo(
        checkRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "back.out",
        },
        0.1
      );
    }

    return () => {
      gsap.killTweensOf(circleRef.current);
      gsap.killTweensOf(checkRef.current);
    };
  }, [show, size]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        ref={circleRef}
        cx={size / 2}
        cy={size / 2}
        r="0"
        fill="none"
        stroke="#4f46e5"
        strokeWidth="2"
      />
      <g
        ref={checkRef}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points={`${size * 0.3},${size * 0.5} ${size * 0.45},${size * 0.65} ${size * 0.7},${size * 0.35}`} />
      </g>
    </svg>
  );
}

/**
 * Animated progress bar
 */
export function AnimatedProgressBar({
  progress,
  duration = 0.5,
  className = "",
}: {
  progress: number;
  duration?: number;
  className?: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;

    gsap.to(barRef.current, {
      width: `${progress}%`,
      duration,
      ease: "power2.out",
    });
  }, [progress, duration]);

  return (
    <div className={`h-1.5 bg-slate-200 rounded-full overflow-hidden ${className}`}>
      <div
        ref={barRef}
        className="h-full w-0 bg-indigo-600 rounded-full"
      />
    </div>
  );
}
