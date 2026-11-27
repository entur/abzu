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

import {
  DirectionsBike as BikeParkingIcon,
  Navigation as BoardingPositionIcon,
  LocalParking as ParkAndRideIcon,
  LocationOn as QuayIcon,
} from "@mui/icons-material";
import type { ElementType } from "../hooks/usePlacement";

export interface StopElementAction {
  icon: React.ReactNode;
  labelKey: string;
  elementType: ElementType;
}

/** What the + can add to an open stop, in menu order. */
export const STOP_ELEMENT_ACTIONS: StopElementAction[] = [
  { icon: <QuayIcon />, labelKey: "map_add_quay", elementType: "quay" },
  {
    icon: <ParkAndRideIcon />,
    labelKey: "map_add_park_and_ride",
    elementType: "parkAndRide",
  },
  {
    icon: <BikeParkingIcon />,
    labelKey: "map_add_bike_parking",
    elementType: "bikeParking",
  },
  {
    icon: <BoardingPositionIcon />,
    labelKey: "map_add_boarding_position",
    elementType: "boardingPosition",
  },
];

/** The name of what is being placed, for the placement hint. */
export const placementLabelKey = (type: string): string =>
  type === "stopPlace"
    ? "map_add_stop_place"
    : (STOP_ELEMENT_ACTIONS.find((action) => action.elementType === type)
        ?.labelKey ?? "map_add_element");

/** A boarding position belongs to a quay, so it needs a focused quay. */
export const actionsFor = (isQuayFocused: boolean): StopElementAction[] =>
  STOP_ELEMENT_ACTIONS.filter(
    (action) => action.elementType !== "boardingPosition" || isQuayFocused,
  );
