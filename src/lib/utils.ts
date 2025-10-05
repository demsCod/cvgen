import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine tailwind classes intelligemment (équivalent shadcn).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
