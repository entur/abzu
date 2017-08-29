import { LatLng } from 'leaflet';

export const getUniquePathLinks = (a, key) => {
  var seen = {};
  return a.filter(function(item) {
    let k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  })
};

export const calculateDistance = coords => {
  let latlngDistances = coords.map(
    position => new LatLng(position[0], position[1]),
  );
  let totalDistance = 0;

  for (let i = 0; i < latlngDistances.length; i++) {
    if (latlngDistances[i + 1] == null) break;
    totalDistance += latlngDistances[i].distanceTo(latlngDistances[i + 1]);
  }
  return totalDistance;
};

export const calculateEstimate = distance => {
  const walkingSpeed = 1.34112; // i.e. 3 mph / 3.6
  return Math.max(Math.floor(distance / walkingSpeed), 1);
};