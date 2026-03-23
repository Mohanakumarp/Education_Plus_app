"use client";

import { ReactNode, useRef, useEffect } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import gsap from "gsap";

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  animateOnHover?: boolean;
  animateOnClick?: boolean;
}

export function AnimatedButton({
  children,
  animateOnHover = true,
  animateOnClick = true,
  ...props
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current || !animateOnHover) return;

    const button = buttonRef.current;

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.03,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [animateOnHover]);

  useEffect(() => {
    if (!buttonRef.current || !animateOnClick) return;

    const button = buttonRef.current;

    const handleClick = () => {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    };

    button.addEventListener("click", handleClick);

    return () => {
      button.removeEventListener("click", handleClick);
    };
  }, [animateOnClick]);

  return (
    <Button ref={buttonRef as any} {...props}>
      {children}
    </Button>
  );
}
