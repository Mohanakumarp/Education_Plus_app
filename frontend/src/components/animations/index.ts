/**
 * Central export file for all animation components and hooks
 * Makes it easy to import animations throughout the app
 */

// Loading animations
export { LoadingAnimation, LoadingSpinner, SkeletonLoader } from "./loading-animation";

// Entrance animations
export {
  FadeInAnimation,
  SlideUpAnimation,
  StaggeredEntranceAnimation,
  ScaleInAnimation,
  CountUpAnimation,
  PulseAnimation,
} from "./entrance-animations";

// Micro-interactions
export {
  useButtonAnimation,
  useCollapseAnimation,
  useFormFieldAnimation,
  useShakeAnimation,
  useSlideDownAnimation,
  useSmoothHeightAnimation,
  SuccessCheckmark,
  AnimatedProgressBar,
} from "./micro-interactions";
