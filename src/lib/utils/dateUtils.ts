export function formatDate(timestamp: string | Date) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAJ",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OKT",
    "NOV",
    "DEC",
  ];
  const month = months[date.getMonth()];

  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function getMonth(timestamp: string | Date) {
  const month = new Date(timestamp).getMonth();
  const months = [
    "Januari",
    "Februari",
    "Mars",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "Augusti",
    "September",
    "Oktober",
    "November",
    "December",
  ];
  return months[month];
}

export function formatDateRange(startDate: string | Date, endDate?: string | Date): string {
  const start = new Date(startDate);
  const startFormatted = start.toLocaleDateString("sv-SE", {
    dateStyle: "long",
  });

  if (!endDate) {
    return startFormatted;
  }

  const end = new Date(endDate);
  const endFormatted = end.toLocaleDateString("sv-SE", {
    dateStyle: "long",
  });

  return `${startFormatted} – ${endFormatted}`;
}

/**
 * Formats a date for display in Swedish format (e.g., "20 Januari")
 */
export function formatEventDate(date: string | Date): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = getMonth(d);
  return `${day} ${month}`;
}

/**
 * Formats a time range for display (e.g., "18:00 - 20:00")
 */
export function formatTimeRange(startDate: string | Date, endDate?: string | Date): string {
  const start = new Date(startDate);
  const startTime = start.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!endDate) {
    return startTime;
  }

  const end = new Date(endDate);
  const endTime = end.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${startTime} - ${endTime}`;
}

/**
 * Formats an address from location object
 */
export function formatAddress(location?: {
  address?: string | null;
  city?: string | null;
  venue?: string | null;
}): string {
  if (!location) return "";
  
  const parts = [
    location.address,
    location.city,
  ].filter(Boolean);
  
  return parts.join(", ");
}

function formatIcalDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const h = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}T${h}${min}${s}Z`;
}

function escapeIcalText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/**
 * Generates a data-URL iCal link for an event. Works with Apple Calendar,
 * Google Calendar, Outlook, etc. No API or server required.
 */
export function generateCalendarLink(
  title: string,
  startDate: string | Date,
  endDate?: string | Date,
  description?: string,
  location?: string
): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 60 * 60 * 1000);
  const now = new Date();
  const uid = `${formatIcalDate(now)}-${Math.random().toString(36).slice(2, 11)}@nackamoderaterna`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nackamoderaterna//Calendar//SV",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcalDate(now)}`,
    `DTSTART:${formatIcalDate(start)}`,
    `DTEND:${formatIcalDate(end)}`,
    `SUMMARY:${escapeIcalText(title)}`,
  ];
  if (description) lines.push(`DESCRIPTION:${escapeIcalText(description)}`);
  if (location) lines.push(`LOCATION:${escapeIcalText(location)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");

  const ics = lines.join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

/**
 * Returns a safe filename for an iCal download, e.g. "Möt-med-borgen-nackamoderaterna.ics"
 */
export function calendarFilename(title: string): string {
  const sanitized = (title || "evenemang")
    .replace(/[\\/:*?"<>|&]+/g, "-")
    .replace(/[\s_\-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "evenemang";
  return `${sanitized}-nackamoderaterna.ics`;
}
