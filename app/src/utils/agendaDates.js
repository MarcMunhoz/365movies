export function formatChallengeDate(watchDate) {
  if (typeof watchDate !== "string") {
    return "";
  }

  const dateParts = watchDate.split(/[/-]/).map(Number);

  if (dateParts.length !== 3 || dateParts.some((part) => !Number.isInteger(part))) {
    return "";
  }

  const [year, month, day] = dateParts;
  const date = new Date(year, month - 1, day);

  if (
    year < 1000 ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "";
  }

  return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
}
