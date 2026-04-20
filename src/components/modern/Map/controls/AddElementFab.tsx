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
  PersonPin as BoardingPositionIcon,
  LocalParking as ParkAndRideIcon,
  Train as QuayIcon,
  DirectionsBus as StopPlaceIcon,
} from "@mui/icons-material";
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useMap } from "react-map-gl/maplibre";
import { StopPlaceActions, UserActions } from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { PlacementHint } from "./PlacementHint";

type ElementType = "quay" | "parkAndRide" | "bikeParking" | "boardingPosition";

interface StopAction {
  icon: React.ReactNode;
  labelKey: string;
  elementType: ElementType;
}

const STOP_ELEMENT_ACTIONS: StopAction[] = [
  {
    icon: <QuayIcon />,
    labelKey: "map_add_quay",
    elementType: "quay",
  },
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

const PARKING_TYPES = new Set<ElementType>(["parkAndRide", "bikeParking"]);

export const AddElementFab = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { current: mapRef } = useMap();
  const [open, setOpen] = useState(false);
  const [pendingElementType, setPendingElementType] =
    useState<ElementType | null>(null);

  const isAuthenticated = useAppSelector(
    (state) => (state.user as any).auth?.isAuthenticated as boolean | undefined,
  );

  const currentStopId = useAppSelector(
    (state) => (state.stopPlace.current as any)?.id as string | undefined,
  );
  const isCreatingNewStop = useAppSelector(
    (state) => (state.user as any).isCreatingNewStop as boolean,
  );
  const quayCount = useAppSelector(
    (state) =>
      ((state.stopPlace.current as any)?.quays as unknown[] | undefined)
        ?.length ?? 0,
  );
  const parkingCount = useAppSelector(
    (state) =>
      ((state.stopPlace.current as any)?.parking as unknown[] | undefined)
        ?.length ?? 0,
  );

  const pendingElementTypeRef = useRef(pendingElementType);
  useEffect(() => {
    pendingElementTypeRef.current = pendingElementType;
  }, [pendingElementType]);

  const quayCountRef = useRef(quayCount);
  useEffect(() => {
    quayCountRef.current = quayCount;
  }, [quayCount]);

  const parkingCountRef = useRef(parkingCount);
  useEffect(() => {
    parkingCountRef.current = parkingCount;
  }, [parkingCount]);

  useEffect(() => {
    if (!mapRef || !isCreatingNewStop) return;
    const map = mapRef.getMap();
    map.getCanvas().style.cursor = "crosshair";
    return () => {
      map.getCanvas().style.cursor = "";
    };
  }, [mapRef, isCreatingNewStop]);

  useEffect(() => {
    if (!mapRef || !pendingElementType) return;
    const map = mapRef.getMap();

    const handlePlacementClick = (e: any) => {
      const elementType = pendingElementTypeRef.current;
      if (!elementType) return;

      const { lat, lng } = e.lngLat;
      const newIndex = PARKING_TYPES.has(elementType)
        ? parkingCountRef.current
        : quayCountRef.current;

      dispatch(StopPlaceActions.addElementToStop(elementType, [lat, lng]));
      dispatch(StopPlaceActions.setElementFocus(newIndex, elementType));
      setPendingElementType(null);
      map.getCanvas().style.cursor = "";
    };

    map.getCanvas().style.cursor = "crosshair";
    map.on("click", handlePlacementClick);

    return () => {
      map.off("click", handlePlacementClick);
      map.getCanvas().style.cursor = "";
    };
  }, [mapRef, pendingElementType, dispatch]);

  if (!isAuthenticated) return null;

  const hasStopSelected = Boolean(currentStopId);

  const handleStartElementPlacement = (elementType: ElementType) => {
    setOpen(false);
    setPendingElementType(elementType);
  };

  const handleAddNewStop = () => {
    setOpen(false);
    dispatch(UserActions.toggleIsCreatingNewStop(false));
  };

  const handleAddNewMultimodalStop = () => {
    setOpen(false);
    dispatch(UserActions.toggleIsCreatingNewStop(true));
  };

  const handleCancelPlacement = () => {
    setPendingElementType(null);
    if (isCreatingNewStop) {
      dispatch(UserActions.toggleIsCreatingNewStop(false));
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!pendingElementType && !isCreatingNewStop) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancelPlacement();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // handleCancelPlacement is recreated each render; pendingElementType and isCreatingNewStop
    // control when the listener is active
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingElementType, isCreatingNewStop]);

  const placementLabelKey = pendingElementType
    ? (STOP_ELEMENT_ACTIONS.find((a) => a.elementType === pendingElementType)
        ?.labelKey ?? "map_add_element")
    : null;

  return (
    <>
      {(pendingElementType || isCreatingNewStop) && (
        <PlacementHint
          messageKey={
            pendingElementType
              ? "map_place_element_hint"
              : "map_creating_stop_hint"
          }
          labelKey={placementLabelKey ?? undefined}
          onCancel={handleCancelPlacement}
        />
      )}
      <SpeedDial
        ariaLabel={formatMessage({ id: "map_add_element" })}
        icon={<SpeedDialIcon />}
        open={open}
        onOpen={() => !pendingElementType && setOpen(true)}
        onClose={() => setOpen(false)}
        direction="up"
        sx={{
          position: "absolute",
          bottom: 96,
          right: 16,
          "& .MuiSpeedDial-fab": {
            bgcolor: pendingElementType ? "warning.main" : "primary.main",
            color: pendingElementType
              ? "warning.contrastText"
              : "primary.contrastText",
            "&:hover": {
              bgcolor: pendingElementType ? "warning.dark" : "primary.dark",
            },
          },
        }}
      >
        {hasStopSelected
          ? STOP_ELEMENT_ACTIONS.map((action) => (
              <SpeedDialAction
                key={action.elementType}
                icon={action.icon}
                slotProps={{
                  tooltip: { title: formatMessage({ id: action.labelKey }) },
                }}
                onClick={() => handleStartElementPlacement(action.elementType)}
                sx={{
                  "& .MuiSpeedDialAction-fab": {
                    bgcolor: theme.palette.background.paper,
                    color: "text.primary",
                  },
                }}
              />
            ))
          : [
              <SpeedDialAction
                key="new-stop"
                icon={<StopPlaceIcon />}
                slotProps={{
                  tooltip: {
                    title: formatMessage({ id: "map_add_stop_place" }),
                  },
                }}
                onClick={handleAddNewStop}
              />,
              <SpeedDialAction
                key="new-multimodal"
                icon={
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      letterSpacing: "0.05em",
                      lineHeight: 1,
                      userSelect: "none",
                    }}
                  >
                    MM
                  </Typography>
                }
                slotProps={{
                  tooltip: {
                    title: formatMessage({ id: "map_add_multimodal_stop" }),
                  },
                }}
                onClick={handleAddNewMultimodalStop}
              />,
            ]}
      </SpeedDial>
    </>
  );
};
