import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to combine Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes The file size in bytes
 * @param decimals Number of decimal places to show
 * @returns A formatted string like "1.5 MB"
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
