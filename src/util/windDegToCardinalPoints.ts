export function degToCardinalPoint(deg?: number): string {
  if (deg === undefined) return "";

  deg = deg % 360;
  if (deg < 0) {
    deg += 360;
  }

  const cardinalPoints = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  const index = Math.round(deg / 45) % 8;

  return cardinalPoints[index];
}
