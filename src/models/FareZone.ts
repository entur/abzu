export interface FareZone {
  id: string;
  name: {
    value: string;
  };
  privateCode: {
    value: string;
  };
  authorityRef: string;
  polygon: {
    type: "Polygon";
    coordinates: [[number, number]];
  };
}
