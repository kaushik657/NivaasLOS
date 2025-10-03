// utils/routeUtils.ts
export interface LatLng {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two points in kilometers using Haversine formula
 */
export function haversineDistance(a: LatLng, b: LatLng): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Estimate travel time in hours/minutes
 */
export function estimateTime(distanceKm: number, avgSpeedKmH = 40): string {
  const hours = distanceKm / avgSpeedKmH;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h} hr ${m} min`;
}

/**
 * Calculate total distance and estimated time for route
 */
export function calculateRoute(
  startPoint: LatLng,
  points: LatLng[]
): { totalDistance: string; estimatedTime: string } {
  let distance = 0;
  let lastPoint = startPoint;

  points.forEach((point) => {
    distance += haversineDistance(lastPoint, point);
    lastPoint = point;
  });

  return {
    totalDistance: distance.toFixed(1) + " km",
    estimatedTime: estimateTime(distance),
  };
}
