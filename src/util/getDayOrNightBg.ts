export default function getDayOrNightBg(): boolean {
  const hours = new Date().getHours();

  return hours >= 7 && hours < 19;
}
