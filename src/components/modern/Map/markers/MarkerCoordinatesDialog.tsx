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

const COORDINATE_DECIMALS = 6;

interface MarkerCoordinatesDialogProps {
  open: boolean;
  lat: number;
  lng: number;
  onClose: () => void;
  /** Same action the marker's drag-end dispatches, with `[lat, lng]`. */
  onSubmit: (position: [number, number]) => void;
}

/**
 * Typing exact coordinates for a map element (F-76, legacy parity). The new
 * position goes through the same action as dragging, then the map follows
 * so the moved marker stays in view.
 */
export const MarkerCoordinatesDialog = ({
  open,
  lat,
  lng,
  onClose,
  onSubmit,
}: MarkerCoordinatesDialogProps) => {
  const activeMap = useAppSelector(
    (state) => (state as any).mapUtils?.activeMap as MapLibreMap | undefined,
  );

  const handleConfirm = ([newLat, newLng]: [number, number]) => {
    const position: [number, number] = [Number(newLat), Number(newLng)];
    onSubmit(position);
    activeMap?.easeTo({ center: [position[1], position[0]] });
    onClose();
  };

  return (
    <CoordinatesDialog
      open={open}
      coordinates={`${lat.toFixed(COORDINATE_DECIMALS)}, ${lng.toFixed(COORDINATE_DECIMALS)}`}
      titleId="change_coordinates"
      bodyId="change_coordinates_help_text"
      confirmId="change_coordinates_confirm"
      handleConfirm={handleConfirm}
      handleClose={onClose}
    />
  );
};
