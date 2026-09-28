/**
 * Calendar Sync Utilities for Learnivia Sessions & Workshops
 * Provides 1-click Google Calendar integration and RFC 5545 compliant .ics file downloads.
 */

interface CalendarEventParams {
  title: string;
  description?: string;
  location?: string;
  startTime: Date | string;
  endTime: Date | string;
}

function formatDateToIcsString(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Generates a direct 1-click Google Calendar Event Creation URL
 */
export function generateGoogleCalendarUrl({
  title,
  description = "",
  location = "Learnivia Online Classroom",
  startTime,
  endTime,
}: CalendarEventParams): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const startIso = formatDateToIcsString(start);
  const endIso = formatDateToIcsString(end);

  const cleanDesc = `${description}\n\nHosted on Learnivia - Free Peer Tutoring & Workshops.\nhttps://learnivia.com`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startIso}/${endIso}`,
    details: cleanDesc,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates standard RFC 5545 .ics file content
 */
export function generateIcsContent({
  title,
  description = "",
  location = "Learnivia Online Classroom",
  startTime,
  endTime,
}: CalendarEventParams): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const nowIso = formatDateToIcsString(new Date());
  const startIso = formatDateToIcsString(start);
  const endIso = formatDateToIcsString(end);
  const uid = `learnivia-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@learnivia.com`;

  const cleanTitle = title.replace(/\n/g, " ");
  const cleanDescription = (
    `${description}\n\nHosted on Learnivia\nhttps://learnivia.com`
  )
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Learnivia//Peer Tutoring Platform//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowIso}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Triggers client-side download of an .ics calendar file
 */
export function downloadIcsFile(params: CalendarEventParams): void {
  if (typeof window === "undefined") return;

  const content = generateIcsContent(params);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const filename = `${params.title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30)}-learnivia.ics`;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
