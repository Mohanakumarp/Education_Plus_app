"use client";

import { ReactNode } from "react";
import { StaggeredEntranceAnimation } from "@/components/animations/entrance-animations";

interface DashboardAnimationWrapperProps {
  children: ReactNode;
}

export function DashboardAnimationWrapper({
  children,
}: DashboardAnimationWrapperProps) {
  return (
    <div className="space-y-8 pb-12">
      <StaggeredEntranceAnimation
        delay={0}
        duration={0.5}
        stagger={0.05}
        className="space-y-8"
      >
        {children}
      </StaggeredEntranceAnimation>
    </div>
  );
}
