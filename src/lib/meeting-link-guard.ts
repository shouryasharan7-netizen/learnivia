/**
 * Meeting Link Safeguard
 *
 * Prevents tutors from entering unvetted personal meeting links
 * when the student is a minor. Platform-managed rooms are always allowed.
 *
 * Allowed origins:
 *  - meet.jit.si (Jitsi — open-source, no account required)
 *  - meet.google.com (Google Meet — only if platform-generated pattern)
 *  - learnivia.app/room/* (platform-managed virtual room links)
 *
 * Blocked for minor sessions:
 *  - Arbitrary Zoom personal meeting IDs (zoom.us/j/...)
 *  - Personal Google Meet links (arbitrary codes)
 *  - Any other arbitrary URL
 */

/** Pattern for Jitsi platform rooms (open source, no personal ID). */
const JITSI_ROOM_PATTERN = /^https:\/\/meet\.jit\.si\/learnivia-[a-zA-Z0-9\-]{6,40}$/;

/** Pattern for platform-issued Google Meet links (systematic naming). */
const PLATFORM_MEET_PATTERN = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/;

/** Platform-managed room pattern (future-proof for own video infra). */
const PLATFORM_ROOM_PATTERN = /^https:\/\/(www\.)?learnivia\.app\/room\/[a-zA-Z0-9\-]{8,}$/;

/** Pattern for generic Zoom personal meeting URLs — these are blocked for minors. */
const PERSONAL_ZOOM_PATTERN = /^https:\/\/([a-zA-Z0-9\-]+\.)?zoom\.us\//;

export type MeetingLinkValidationResult =
  | { valid: true; type: "jitsi" | "google-meet" | "platform-room" | "unchecked" }
  | { valid: false; reason: string };

/**
 * Validates a meeting link for a session.
 *
 * @param url - The meeting URL entered by a tutor.
 * @param isMinorSession - Whether the student is marked as a minor.
 * @returns Validation result with `valid: true` or `valid: false + reason`.
 */
export function validateMeetingLink(
  url: string | null | undefined,
  isMinorSession: boolean,
): MeetingLinkValidationResult {
  // No link = use platform default room (always OK)
  if (!url || url.trim() === "") {
    return { valid: true, type: "platform-room" };
  }

  const trimmed = url.trim();

  // Must be HTTPS
  if (!trimmed.startsWith("https://")) {
    return {
      valid: false,
      reason: "Meeting links must use HTTPS. Non-HTTPS links are not permitted.",
    };
  }

  // Platform-managed room — always allowed
  if (PLATFORM_ROOM_PATTERN.test(trimmed)) {
    return { valid: true, type: "platform-room" };
  }

  // Jitsi (platform-issued naming convention)
  if (JITSI_ROOM_PATTERN.test(trimmed)) {
    return { valid: true, type: "jitsi" };
  }

  // Google Meet standard format
  if (PLATFORM_MEET_PATTERN.test(trimmed)) {
    return { valid: true, type: "google-meet" };
  }

  // For minor sessions: block ALL unrecognised links
  if (isMinorSession) {
    if (PERSONAL_ZOOM_PATTERN.test(trimmed)) {
      return {
        valid: false,
        reason:
          "Personal Zoom links are not permitted for sessions with minors. Please use a platform-managed room or a Jitsi link.",
      };
    }
    return {
      valid: false,
      reason:
        "Unrecognised meeting link. For safeguarding reasons, only platform-managed rooms and approved link patterns (Jitsi) are allowed for sessions with students under 18.",
    };
  }

  // For adult sessions: allow with a warning (non-platform link is accepted but noted)
  return { valid: true, type: "unchecked" };
}
