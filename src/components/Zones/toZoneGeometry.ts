import type { MultiPolygon, Polygon } from "geojson";
import { TariffZone } from "../../models/TariffZone";

type ZonePolygon = TariffZone["polygon"];

const reverseToLngLat = ([lat, lng]: number[]): number[] => [lng, lat];

export const toZoneGeometry = (polygon: ZonePolygon): Polygon | MultiPolygon =>
  polygon.type === "MultiPolygon"
    ? {
        type: "MultiPolygon",
        coordinates: (polygon.coordinates as number[][][][]).map((rings) =>
          rings.map((ring) => ring.map(reverseToLngLat)),
        ),
      }
    : {
        type: "Polygon",
        coordinates: (polygon.coordinates as number[][][]).map((ring) =>
          ring.map(reverseToLngLat),
        ),
      };
