import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a camelCase or PascalCase string to Title Case with spaces.
 * Examples:
 * - "createdAt" -> "Created At"
 * - "firstName" -> "First Name"
 * - "userID" -> "User ID"
 * - "HTMLParser" -> "HTML Parser"
 */
export function toTitleCase(str: string): string {
  return (
    str
      // Insert space before uppercase letters that follow lowercase letters
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // Insert space before uppercase letters that are followed by lowercase letters (for acronyms)
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      // Capitalize the first letter
      .replace(/^./, (char) => char.toUpperCase())
  );
}
