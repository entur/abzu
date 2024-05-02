export interface TariffZone {
  id: string;
  name: {
    value: string;
  };
  polygon: {
    type: "Polygon";
    legacyCoordinates: [[number, number]];
  };
}
