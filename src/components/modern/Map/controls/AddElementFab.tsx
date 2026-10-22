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
  Add as AddIcon,
  DirectionsBike as BikeParkingIcon,
  Navigation as BoardingPositionIcon,
  Close as CloseIcon,
  LocalParking as ParkAndRideIcon,
  LocationOn as QuayIcon,
} from "@mui/icons-material";
import {
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Marker } from "react-map-gl/maplibre";
import { useAppSelector } from "../../../../store/hooks";
import { addItemButtonSx } from "../../Shared";
import { DragCrosshair } from "../crosshair";
import { useCanEditOnMap } from "../hooks/useCanEditOnMap";
import { useIsEditingGroup } from "../hooks/useIsEditingGroup";
import { useMapCurrentStop } from "../hooks/useMapCurrentStop";
import { ElementType, usePlacement } from "./hooks/usePlacement";
import { NewStopConfirm } from "./NewStopConfirm";
import { PlacementHint } from "./PlacementHint";

interface StopAction {
  icon: React.ReactNode;
  labelKey: string;
  elementType: ElementType;
}

const DRAWER_WIDTH = 450;
const FAB_SIZE = 56;
const FAB_GAP = 8;
const FAB_TOP = 16;

const STOP_ELEMENT_ACTIONS: StopAction[] = [
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

const placementLabelKey = (type: string): string =>
  type === "stopPlace"
    ? "map_add_stop_place"
    : (STOP_ELEMENT_ACTIONS.find((action) => action.elementType === type)
        ?.labelKey ?? "map_add_element");

/**
 * The map's + (F-10, F-12, F-13).
 * - No stop open: a plain button that starts placing a new stop.
 * - A stop open: a menu of its elements, opened and closed by click only,
 *   with labels always visible.
 * - While placing: the + turns into a yellow × that cancels, with a hint
 *   docked next to it.
 */
export const AddElementFab = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  const {
    placementType,
    startPlacement,
    cancelPlacement,
    pendingStopPosition,
    clearPendingStopPosition,
    crosshairSetting,
    pointerPosition,
  } = usePlacement();

  const isAuthenticated = useAppSelector(
    (state) => (state.user as any).auth?.isAuthenticated as boolean | undefined,
  );
  /* An unsaved new stop has no id yet but is still open in the editor, so
     "open" means current is set, not that it has an id (F-16). */
  const current = useMapCurrentStop();
  const isEditorOpen = !!current;
  const isParentOpen = !!current?.isParent;
  const canEditOpenStop = useCanEditOnMap(current);
  const isEditingGroup = useIsEditingGroup();
  const focusedElement = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedElement as
        { type: string; index: number } | undefined,
  );
  const isQuayFocused =
    focusedElement?.type === "quay" && (focusedElement?.index ?? -1) >= 0;

  // Opening or closing an editor changes what + places; don't carry it over.
  useEffect(() => {
    cancelPlacement();
    setOpen(false);
  }, [isEditorOpen, cancelPlacement]);

  // All hooks must run above these guards: the map stays mounted across the
  // login transition, so an early return before a hook changes the hook count.
  if (!isAuthenticated) return null;
  // Quays and parking belong to the child stops, never the multimodal parent (F-35).
  if (isParentOpen) return null;
  // Nothing to add to a group; the previous stop is no longer open (F-88).
  if (isEditingGroup) return null;
  // A read-only stop or an older version gets no new elements (F-96).
  if (isEditorOpen && !canEditOpenStop) return null;

  const isPlacing = !!placementType;
  const fabLeft = isEditorOpen ? DRAWER_WIDTH + FAB_GAP : FAB_GAP;
  const fabSx = {
    // Paper background with a semantic icon colour, warning while placing.
    ...addItemButtonSx(isPlacing ? "warning.main" : "primary.main"),
    // Floats over the map, so it needs more lift than an in-panel button.
    boxShadow: 3,
  };
  /** Passed via slotProps.fab to style each action's internal Fab. */
  const actionFabSx = {
    bgcolor: theme.palette.grey.A100,
    color: theme.palette.text.primary,
    transition: "background-color 0.2s, color 0.2s",
    "&:hover": {
      bgcolor: theme.palette.grey[800],
      color: theme.palette.common.white,
    },
  };

  const handleStartElement = (elementType: ElementType) => {
    setOpen(false);
    startPlacement(elementType);
  };

  return (
    <>
      {/* Same crosshair a drag uses, following the pointer until you click. */}
      {isPlacing && pointerPosition && crosshairSetting !== "none" && (
        <Marker
          latitude={pointerPosition.latitude}
          longitude={pointerPosition.longitude}
          anchor="center"
          style={{ pointerEvents: "none" }}
        >
          <DragCrosshair type={crosshairSetting} />
        </Marker>
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
        <SpeedDial
          ariaLabel={formatMessage({ id: "map_add_element" })}
          icon={isPlacing ? <CloseIcon /> : <SpeedDialIcon />}
          open={open}
          // Click only: hover and focus used to open it, so the click that
          // followed closed it again (F-10).
          onOpen={(_, reason) => {
            if (reason === "toggle" && !isPlacing) setOpen(true);
          }}
          onClose={(_, reason) => {
            if (reason !== "mouseLeave") setOpen(false);
          }}
          direction="down"
          // While placing, the × cancels; MUI's own toggle then sees isPlacing
          // and stays closed.
          FabProps={{ onClick: isPlacing ? cancelPlacement : undefined }}
          sx={{
            position: "absolute",
            top: FAB_TOP,
            left: fabLeft,
            transition: "left 0.3s ease-in-out",
            "& .MuiSpeedDial-fab": fabSx,
          }}
        >
          {STOP_ELEMENT_ACTIONS.filter(
            (action) =>
              action.elementType !== "boardingPosition" || isQuayFocused,
          ).map((action) => (
            <SpeedDialAction
              key={action.elementType}
              icon={action.icon}
              slotProps={{
                // Labels always visible, also on touch devices (F-10a).
                tooltip: {
                  title: formatMessage({ id: action.labelKey }),
                  open: true,
                  placement: "right",
                },
                fab: { sx: actionFabSx },
                staticTooltipLabel: { sx: { whiteSpace: "nowrap" } },
              }}
              onClick={() => handleStartElement(action.elementType)}
            />
          ))}
        </SpeedDial>
      ) : (
        <Tooltip
          title={formatMessage({
            id: isPlacing ? "cancel" : "map_add_stop_place",
          })}
          // Below, so it never covers the placement hint docked to the right.
          placement="bottom"
        >
          <Fab
            aria-label={formatMessage({
              id: isPlacing ? "cancel" : "map_add_stop_place",
            })}
            onClick={
              isPlacing ? cancelPlacement : () => startPlacement("stopPlace")
            }
            sx={{
              position: "absolute",
              top: FAB_TOP,
              left: fabLeft,
              ...fabSx,
            }}
          >
            {isPlacing ? <CloseIcon /> : <AddIcon />}
          </Fab>
        </Tooltip>
      )}
    </>
  );
};
