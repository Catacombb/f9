
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine animation classes with Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Animation classes for different components
 */
export const animations = {
  fadeIn: "animate-fade-in",
  slideIn: "animate-slide-in",
  slideInRight: "animate-slide-in-right",
  pop: "animate-pop",
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce",
  ping: "animate-ping"
};

/**
 * Check if reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  return prefersReducedMotion.matches;
}
