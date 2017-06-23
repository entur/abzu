import L from 'leaflet';
import { setDecimalPrecision } from './'

export const getCentroid = (latlngs = [[]], originalCentroid) => {

  if (!latlngs.length) {
    return originalCentroid;
  }

  let polygon = L.polygon(latlngs);
  let center = polygon.getBounds().getCenter();

  if (center.lat && center.lng) {
    return [setDecimalPrecision(center.lat, 6), setDecimalPrecision(center.lng, 6)];
  }

  return originalCentroid;
}

/* Polygon from Tiamat is formatted as [lng, lat], while Leaflet uses [lat, lng]*/
export const isCoordinatesInsidePolygon = (coordinates, polyPoints) => {
  const x = coordinates[0];
  const y = coordinates[1];
  let inside = false;

  for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    let xi = polyPoints[i][1], yi = polyPoints[i][0];
    let xj = polyPoints[j][1], yj = polyPoints[j][0];

    let intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}