/**
 * Utility to extract appropriate host and participant URLs from stored workshop links.
 * Works seamlessly across:
 * 1. Zoom API meetings (providing start_url with host token for tutor, join_url for students)
 * 2. Personal Zoom / Google Meet links
 * 3. 1-Click Learnivia Live Video Rooms
 */
export function getMeetingUrls(zoomLink: string | null | undefined): {
  hostUrl: string;
  joinUrl: string;
  isCustom: boolean;
} {
  if (!zoomLink) {
    return { hostUrl: "", joinUrl: "", isCustom: false };
  }

  // If stored as JSON
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
