"use client";

import { ReactNode } from "react";
import { StaggeredEntranceAnimation } from "@/components/animations/entrance-animations";

interface AnimatedDashboardProps {
  children: ReactNode;
}

export function AnimatedDashboardContent({ children }: AnimatedDashboardProps) {
  return (
    <StaggeredEntranceAnimation
      delay={0.1}
      duration={0.6}
      stagger={0.08}
      className="w-full"
    >
      {children}
    </StaggeredEntranceAnimation>
  );
}
