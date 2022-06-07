export interface FareZone {
  id: string;
  name: {
    value: string;
  };
  privateCode: {
    value: string;
  };
  polygon: {
    type: "Polygon";
    coordinates: [[number, number]];
  };
}
