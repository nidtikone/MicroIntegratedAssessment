// Mirrors the server's email check (server is authoritative; this is for UX).
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

import type { AnswerValue } from '../types';

/** An answer is "empty" (counts as unanswered for required-checks). */
export function isEmptyAnswer(v: AnswerValue | undefined): boolean {
  return (
    v === undefined ||
    v === null ||
    (typeof v === 'string' && v.trim() === '') ||
    (Array.isArray(v) && v.length === 0)
  );
}
