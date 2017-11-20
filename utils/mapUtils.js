/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */


import L from 'leaflet';
import { setDecimalPrecision } from './';

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
};

export const sortPolygonByAngles = (points) => {

  if (!points.length || !points[0].length) return null;

  const polygon = L.polygon(points);

    const center = polygon.getBounds().getCenter();
    const { lat, lng } = center;

    return points[0].sort((posA, posB) => {
      const angleA = Math.atan2(posA[1]-lng, posA[0]-lat);
      const angleB = Math.atan2(posB[1]-lng, posB[0]-lat);
      return angleB - angleA;
    });
};