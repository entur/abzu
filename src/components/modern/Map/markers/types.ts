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

/** Coordinates as stored in Redux: [latitude, longitude] */
export type LatLng = [number, number];

/** Coordinates in GeoJSON / MapLibre format: [longitude, latitude] */
export type LngLat = [number, number];

/** Legacy geometry from the Tiamat API — coordinates are [lng, lat] (GeoJSON order) */
export interface LegacyGeometry {
  legacyCoordinates?: LngLat[];
}

export interface BoardingPosition {
  id: string;
  publicCode?: string;
  location?: LatLng;
}

export interface MapQuay {
  id: string;
  publicCode?: string;
  privateCode?: string;
  location?: LatLng;
  compassBearing?: number;
  boardingPositions?: BoardingPosition[];
}

export interface MapParking {
  id: string;
  name?: string;
  parkingType: string;
  location?: LatLng;
  totalCapacity?: number;
}

export interface ChildStop {
  id: string;
  location?: LatLng;
  geometry?: LegacyGeometry;
}

export interface MapStopPlace {
  id: string;
  name?: string;
  stopPlaceType?: string;
  submode?: string;
  location?: LatLng;
  isParent?: boolean;
  permanentlyTerminated?: boolean;
  quays?: MapQuay[];
  parking?: MapParking[];
  children?: ChildStop[];
}

interface PlaceRef {
  ref?: string;
  addressablePlace?: {
    id?: string;
    geometry?: LegacyGeometry;
  };
}

export interface PathLink {
  id?: string;
  from?: { placeRef?: PlaceRef };
  to?: { placeRef?: PlaceRef };
  /** Intermediate waypoints — stored in Redux as [lat, lng] */
  inBetween?: LatLng[];
  distance?: number;
  estimate?: number;
}

export interface NeighbourStop {
  id: string;
  name?: string;
  stopPlaceType?: string;
  submode?: string;
  location?: LatLng;
  isParent?: boolean;
}

export interface FocusedElement {
  type: "quay" | "parking";
  index: number;
}

export interface FocusedBoardingPosition {
  index: number;
  quayIndex: number;
}
