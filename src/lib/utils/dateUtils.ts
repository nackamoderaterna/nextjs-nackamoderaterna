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

/**
 * Generates a Google Calendar link for an event
 */
export function generateCalendarLink(
  title: string,
  startDate: string | Date,
  endDate?: string | Date,
  description?: string,
  location?: string
): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 60 * 60 * 1000); // Default to 1 hour if no end date
  
  // Format dates for Google Calendar (YYYYMMDDTHHmmssZ)
  const formatDate = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatDate(start)}/${formatDate(end)}`,
    details: description || "",
    location: location || "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
