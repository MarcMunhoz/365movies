const ICS_REMINDER_OFFSET_DAYS = 2;

const parseAgendaDate = (watchDate) => {
  if (typeof watchDate !== "string") {
    return null;
  }

  const [year, month, day] = watchDate.split(/[/-]/).map(Number);
  const date = new Date(year, month - 1, day);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const formatIcsDate = (date) =>
  `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;

const escapeIcsText = (value) =>
  String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

const addDays = (date, amount) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
};

export const getFutureUnwatchedAgendaItems = (movies, currentDate = new Date()) => {
  const startOfToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  return (movies || [])
    .map((movie) => ({ movie, watchDate: parseAgendaDate(movie.watchDate) }))
    .filter(({ movie, watchDate }) => watchDate && !movie.watched && watchDate >= startOfToday);
};

export const buildAgendaIcs = (movies, options = {}) => {
  const now = options.now || new Date();
  const productId = options.productId || "-//365movies//Agenda Reminders//EN";
  const timestamp = `${formatIcsDate(now)}T${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
  const events = getFutureUnwatchedAgendaItems(movies, now).map(({ movie, watchDate }) => {
    const eventDate = formatIcsDate(watchDate);
    const eventEndDate = formatIcsDate(addDays(watchDate, 1));
    const uid = `${movie.movieID || movie.movieTitle}-${eventDate}@365movies`;
    const summary = `Watch ${movie.movieTitle || "scheduled movie"}`;
    const description = movie.movieLink
      ? `Scheduled in 365movies: ${movie.movieLink}`
      : "Scheduled in 365movies";

    return [
      "BEGIN:VEVENT",
      `UID:${escapeIcsText(uid)}`,
      `DTSTAMP:${timestamp}Z`,
      `DTSTART;VALUE=DATE:${eventDate}`,
      `DTEND;VALUE=DATE:${eventEndDate}`,
      `SUMMARY:${escapeIcsText(summary)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      "BEGIN:VALARM",
      `TRIGGER:-P${ICS_REMINDER_OFFSET_DAYS}D`,
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcsText(summary)}`,
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${productId}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
};
