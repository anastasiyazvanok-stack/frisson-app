export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function previousDay(date = new Date()) {
  const previous = new Date(date); previous.setDate(previous.getDate() - 1);
  return localDay(previous);
}
