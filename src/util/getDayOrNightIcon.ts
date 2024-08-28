export function getDayOrNightIcon(iconName: string, dateTimeString: string): string {
  const hours = new Date(dateTimeString).getHours();

  const idDayTime = hours >= 7 && hours < 19;

  return idDayTime ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n");
}
