// Shared by the browser forms and the API so both enforce the same rules.
import { SOCIAL } from './site';
import { universityForEmail } from './universities';

export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 100;

export const MAX_INTERESTS = 5;
export const INTEREST_MAX_LENGTH = 30;

export const MESSAGE_MAX_LENGTH = 500;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return email.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(email);
}

/** Returns an error message, or null when the registration details are acceptable. */
export function registrationError(email: string, password: string): string | null {
  if (!isValidEmail(email)) return 'Enter a valid email address.';
  if (!universityForEmail(email)) {
    return `CamRa isn't available at your university yet. Email us at ${SOCIAL.email} and we'll work on adding it!`;
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`;
  }
  return null;
}

export function normalizeInterest(tag: string) {
  return tag.trim().replace(/\s+/g, ' ').toLowerCase().slice(0, INTEREST_MAX_LENGTH);
}

export function normalizeInterests(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const tags = value.filter((tag): tag is string => typeof tag === 'string').map(normalizeInterest);
  return [...new Set(tags.filter(Boolean))].slice(0, MAX_INTERESTS);
}
