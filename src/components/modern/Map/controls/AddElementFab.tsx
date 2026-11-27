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

import { useEffect } from "react";
import { EditorSpeedDial } from "./EditorSpeedDial";
import { useAddElementAvailability } from "./hooks/useAddElementAvailability";
import { usePlacement } from "./hooks/usePlacement";
import { NewStopConfirm } from "./NewStopConfirm";
import { NewStopFab } from "./NewStopFab";
import { PlacementCrosshair } from "./PlacementCrosshair";
import { PlacementHint } from "./PlacementHint";
import { FAB_SIZE } from "./utils/addElementFabSx";
import { FAB_GAP } from "./utils/fabPosition";
import { placementLabelKey } from "./utils/stopElementActions";

/**
 * The map's + (F-10, F-12, F-13).
 * - No stop open: a plain button that starts placing a new stop.
 * - A stop open: a menu of its elements (EditorSpeedDial).
 * - While placing: the + turns into a yellow × that cancels, with a hint
 *   docked next to it and the crosshair following the pointer.
 */
export const AddElementFab = () => {
  const {
    placementType,
    startPlacement,
    cancelPlacement,
    pendingStopPosition,
    clearPendingStopPosition,
    crosshairSetting,
    pointerPosition,
  } = usePlacement();
  const { isAvailable, isEditorOpen, isQuayFocused, fabLeft } =
    useAddElementAvailability();

  // Opening or closing an editor changes what + places; don't carry it over.
  useEffect(() => {
    cancelPlacement();
  }, [isEditorOpen, cancelPlacement]);

  if (!isAvailable) return null;
  const isPlacing = !!placementType;

  return (
    <>
      {isPlacing && (
        <PlacementCrosshair
          pointerPosition={pointerPosition}
          crosshairSetting={crosshairSetting}
        />
      )}

      {placementType && (
        <PlacementHint
          left={fabLeft + FAB_SIZE + FAB_GAP}
          messageKey={
            placementType === "stopPlace"
              ? "map_creating_stop_hint"
              : "map_place_element_hint"
          }
          labelKey={placementLabelKey(placementType)}
          onCancel={cancelPlacement}
        />
      )}

      {pendingStopPosition && (
        <NewStopConfirm
          position={pendingStopPosition}
          onCancel={clearPendingStopPosition}
          onCreated={cancelPlacement}
        />
      )}

      {isEditorOpen ? (
        <EditorSpeedDial
          left={fabLeft}
          isPlacing={isPlacing}
          isQuayFocused={isQuayFocused}
          onStartElement={startPlacement}
          onCancelPlacement={cancelPlacement}
        />
      ) : (
        <NewStopFab
          left={fabLeft}
          isPlacing={isPlacing}
          onStart={() => startPlacement("stopPlace")}
          onCancel={cancelPlacement}
        />
      )}
    </>
  );
};
