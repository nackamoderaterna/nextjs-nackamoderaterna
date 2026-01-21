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
