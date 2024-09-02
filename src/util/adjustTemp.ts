export function adjustTemp(apiTemp?: number): string {
  if (apiTemp === undefined) return "No Data";

  const tempFixed = apiTemp.toFixed(1);

  if (tempFixed[tempFixed.length - 1] === "0") return Math.round(apiTemp).toString();

  return tempFixed;
}
