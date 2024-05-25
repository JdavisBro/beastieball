const START_DATE = new Date(1900, 0, -1).getTime(); // idk but it starts on day -1 of january 1900 or i guess 31 december 1899

export default function parseDate(date: number): Date {
  const date_ms = date * 24 * 60 * 60 * 1000;
  return new Date(START_DATE + date_ms);
}
