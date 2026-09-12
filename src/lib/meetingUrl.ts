/**
 * Approved meeting domains for Learnivia platform sessions.
 * P1-10: Only these domains are permitted as meeting links.
 * Any other URL must be rejected before storage.
 */
const APPROVED_MEETING_DOMAINS = [
  "zoom.us",
  "us02web.zoom.us",
  "us04web.zoom.us",
  "us05web.zoom.us",
  "us06web.zoom.us",
  "meet.google.com",
  // Learnivia's own domain (future: in-platform video)
  "learnivia-green.vercel.app",
  "learnivia.org",
];

/**
 * Validates a meeting URL before storage.
 * Returns { valid: true } if the URL is from an approved domain.
 * Returns { valid: false, reason: string } otherwise.
 *
 * P1-10: Prevents tutors from inserting malicious or off-platform contact URLs.
 */
export function validateMeetingUrl(url: string | null | undefined): {
  valid: boolean;
  reason?: string;
} {
  if (!url || !url.trim()) {
    return { valid: true }; // Empty/null is valid (no meeting link)
  }

  // Must be HTTPS
  if (!url.startsWith("https://")) {
    return {
      valid: false,
      reason: "Meeting links must use HTTPS.",
    };
  }

  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.toLowerCase();

    // Check against approved domain list (allow subdomains of approved domains)
    const isApproved = APPROVED_MEETING_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );

    if (!isApproved) {
      return {
        valid: false,
        reason: `Meeting links must be from an approved video provider (Zoom or Google Meet). The domain "${hostname}" is not permitted.`,
      };
    }

    return { valid: true };
  } catch {
    return {
      valid: false,
      reason: "Invalid meeting URL format.",
    };
  }
}

/**
 * Utility to extract appropriate host and participant URLs from stored meeting links.
 * Works across:
 * 1. Zoom API meetings (JSON with start_url + join_url)
 * 2. Zoom personal links
 * 3. Google Meet links
 */
export function getMeetingUrls(zoomLink: string | null | undefined): {
  hostUrl: string;
  joinUrl: string;
  isCustom: boolean;
} {
  if (!zoomLink) {
    return { hostUrl: "", joinUrl: "", isCustom: false };
  }

  // If stored as JSON (from Zoom API)
  if (zoomLink.trim().startsWith("{")) {
    try {
      const data = JSON.parse(zoomLink);
      return {
        hostUrl: data.startUrl || data.joinUrl || "",
        joinUrl: data.joinUrl || data.startUrl || "",
        isCustom: Boolean(data.isCustom),
      };
    } catch {
      // Fall through to plain string handling
    }
  }

  const trimmed = zoomLink.trim();

  // If it is a standard Zoom URL with /j/, the host start URL is /s/
  const hostUrl = trimmed.includes("/j/")
    ? trimmed.replace("/j/", "/s/")
    : trimmed;

  return {
    hostUrl,
    joinUrl: trimmed,
    isCustom: !trimmed.includes("zoom.us"),
  };
}
