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

import { Marker } from "react-map-gl/maplibre";
import { DragCrosshair } from "../crosshair";
import type { Placement } from "./hooks/usePlacement";

type PlacementCrosshairProps = Pick<
  Placement,
  "pointerPosition" | "crosshairSetting"
>;

/** While placing, the same crosshair a drag uses follows the pointer. */
export const PlacementCrosshair = ({
  pointerPosition,
  crosshairSetting,
}: PlacementCrosshairProps) => {
  if (!pointerPosition || crosshairSetting === "none") return null;
  return (
    <Marker
      latitude={pointerPosition.latitude}
      longitude={pointerPosition.longitude}
      anchor="center"
      style={{ pointerEvents: "none" }}
    >
      <DragCrosshair type={crosshairSetting} />
    </Marker>
  );
};
