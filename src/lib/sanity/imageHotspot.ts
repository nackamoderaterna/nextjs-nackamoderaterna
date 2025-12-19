// lib/sanity/imageHotspot.ts
export function getObjectPositionFromHotspot(image: any): string {
  // Check if we have valid hotspot data
  if (
    !image?.hotspot ||
    typeof image.hotspot.x !== "number" ||
    typeof image.hotspot.y !== "number"
  ) {
    return "center center"; // Better default
  }

  const { x, y } = image.hotspot;

  // Clamp values to 0-1 range (safety check)
  const clampedX = Math.max(0, Math.min(1, x));
  const clampedY = Math.max(0, Math.min(1, y));

  // Convert to percentages
  const xPercent = Math.round(clampedX * 100);
  const yPercent = Math.round(clampedY * 100);

  return `${xPercent}% ${yPercent}%`;
}
