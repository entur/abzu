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