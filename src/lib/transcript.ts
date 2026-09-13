import crypto from "crypto";

/**
 * Generates an HMAC verification token for a tutor's transcript.
 * This allows tutors to share a public link with school counselors or evaluators
 * without requiring the counselor to create an account.
 */
export function generateTranscriptToken(tutorId: string): string {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "learnivia-transcript-verification-key";
  return crypto
    .createHmac("sha256", secret)
    .update(`transcript:${tutorId}`)
    .digest("hex")
    .slice(0, 24);
}

/**
 * Validates a given transcript token in constant time.
 */
export function verifyTranscriptToken(tutorId: string, token: string | undefined | null): boolean {
  if (!token || typeof token !== "string" || token.length !== 24) {
    return false;
  }
  const expected = generateTranscriptToken(tutorId);
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
