export interface TariffZone {
  id: string;
  name: {
    value: string;
  };
  polygon: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}
