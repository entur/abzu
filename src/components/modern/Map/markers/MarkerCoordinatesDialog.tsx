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

import type { Map as MapLibreMap } from "maplibre-gl";
import { useAppSelector } from "../../../../store/hooks";
import { CoordinatesDialog } from "../../Dialogs/CoordinatesDialog";
import type { CoordinatesReference } from "../../Dialogs/hooks/useCoordinatesForm";

const COORDINATE_DECIMALS = 6;

interface MarkerCoordinatesDialogProps {
  open: boolean;
  lat: number;
  lng: number;
  onClose: () => void;
  /**
   * Same move the marker's drag-end makes, with `[lat, lng]`. Resolves to
   * false when the move was refused (outside the user's area, F-106).
   */
  onSubmit: (position: [number, number]) => Promise<boolean>;
  /** Where the element is expected to be (F-103). */
  reference?: CoordinatesReference;
}

/**
 * Typing exact coordinates for a map element (F-76, legacy parity). The new
 * position goes through the same checked move as dragging, then the map
 * follows so the moved marker stays in view.
 */
export const MarkerCoordinatesDialog = ({
  open,
  lat,
  lng,
  onClose,
  onSubmit,
  reference,
}: MarkerCoordinatesDialogProps) => {
  const activeMap = useAppSelector(
    (state) => (state as any).mapUtils?.activeMap as MapLibreMap | undefined,
  );

  const handleConfirm = async (position: [number, number]) => {
    onClose();
    const isMoved = await onSubmit(position);
    if (isMoved) activeMap?.easeTo({ center: [position[1], position[0]] });
  };

  return (
    <CoordinatesDialog
      open={open}
      coordinates={`${lat.toFixed(COORDINATE_DECIMALS)}, ${lng.toFixed(COORDINATE_DECIMALS)}`}
      titleId="change_coordinates"
      bodyId="change_coordinates_help_text"
      confirmId="change_coordinates_confirm"
      reference={reference}
      handleConfirm={handleConfirm}
      handleClose={onClose}
    />
  );
};
