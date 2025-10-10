import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get a user's display name with fallbacks
 * @param user User object with first_name, last_name, and company_name
 * @param fallback Default fallback text (e.g., 'User', 'Vendor', 'Buyer')
 * @returns Display name string
 */
export function getUserDisplayName(user: { id?: string; first_name?: string | null; last_name?: string | null; company_name?: string | null; avatar_url?: string | null } | null | undefined, fallback: string = 'User'): string {
  if (!user) return fallback;
  
  const firstName = user.first_name?.trim() || '';
  const lastName = user.last_name?.trim() || '';
  const fullName = `${firstName} ${lastName}`.trim();
  
  
  return fullName || user.company_name || fallback;
}

/**
 * Get user initials for avatars
 * @param user User object with first_name, last_name, and company_name
 * @param fallback Default fallback initial (e.g., 'U', 'V', 'B')
 * @returns Initials string (1-2 characters)
 */
export function getUserInitials(user: { id?: string; first_name?: string | null; last_name?: string | null; company_name?: string | null; avatar_url?: string | null } | null | undefined, fallback: string = 'U'): string {
  if (!user) return fallback;
  
  const firstName = user.first_name?.trim() || '';
  const lastName = user.last_name?.trim() || '';
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`;
  } else if (firstName) {
    return firstName[0];
  } else if (user.company_name?.trim()) {
    return user.company_name.trim()[0];
  }
  
  return fallback;
}
