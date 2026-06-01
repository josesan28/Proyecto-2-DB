const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function formatReportDate(value) {
  if (value == null) return "—";

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const day = String(value.getUTCDate()).padStart(2, "0");
    const month = MONTHS[value.getUTCMonth()] ?? "";
    const year = value.getUTCFullYear();
    return `${day} ${month} ${year}`.trim();
  }

  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      const monthLabel = MONTHS[Number(month) - 1] ?? month;
      return `${day} ${monthLabel} ${year}`;
    }
  }

  return String(value);
}

export function isDateLikeKey(key) {
  return /fecha|date|time/i.test(key);
}