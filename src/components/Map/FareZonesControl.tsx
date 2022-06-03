import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Polygon } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import {
  getFareZones,
  getFareZonesForFilter,
} from "../../actions/TiamatActions";
import Control from "react-leaflet-custom-control";
import {
  LinearProgress,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography,
  Popover,
} from "@mui/material";
import { AnyAction } from "redux";
import { ControlPosition } from "leaflet";
import { FareZone } from "../../models/FareZone";
import { Box } from "@mui/system";
import { ExpandMore } from "@mui/icons-material";

export interface FareZonesLayerProps {
  show: boolean;
  position: ControlPosition;
  fareZones: FareZone[];
}

type AppState = {
  mapUtils: {
    showFareZones: boolean;
    fareZonesForFilter: FareZone[];
    fareZones: FareZone[];
  };
};

export const FareZonesControl: React.FC<FareZonesLayerProps> = ({
  position,
}) => {
  const [expandedCodespace, setExpandedCodespace] = useState<
    string | undefined
  >();
  const [selectedFareZones, setSelectedFareZones] = useState<string[]>([]);
  const itemsRef = useRef<Record<string, HTMLElement | null>>({});

  const dispatch = useDispatch();

  const show = useSelector<AppState, boolean>(
    (state) => state.mapUtils.showFareZones
  );
  const fareZonesForFilter = useSelector<AppState, FareZone[]>(
    (state) => state.mapUtils.fareZonesForFilter
  );
  const fareZones = useSelector<AppState, FareZone[]>(
    (state) => state.mapUtils.fareZones
  );

  const groupedFarezonesForFilter = useMemo(() => {
    return fareZonesForFilter.reduce(
      (acc: Record<string, FareZone[]>, next: FareZone) => {
        const codespace = next.id.split(":")[0];
        acc[codespace] ? acc[codespace].push(next) : (acc[codespace] = [next]);
        return acc;
      },
      {}
    );
  }, [fareZonesForFilter]);

  useEffect(() => {
    const fareZoneIds = selectedFareZones.filter(
      (id) => !fareZones.some((fareZone) => fareZone.id === id)
    );

    if (fareZoneIds.length > 0) {
      dispatch(
        getFareZones(
          selectedFareZones.filter(
            (id) => !fareZones.some((fareZone) => fareZone.id === id)
          )
        ) as unknown as AnyAction
      );
    }
  }, [selectedFareZones]);

  useEffect(() => {
    if (show) {
      dispatch(getFareZonesForFilter() as unknown as AnyAction);
    }
  }, [show]);

  const toggleFareZoneSelection = useCallback(
    (id: string, checked: boolean) => {
      setSelectedFareZones((prev: string[]) =>
        checked ? prev.concat([id]) : prev.filter((selected) => selected !== id)
      );
    },
    []
  );

  const toggleCodespaceSelection = useCallback(
    (codespace: string, checked: boolean) => {
      if (checked) {
        setSelectedFareZones((prev: string[]) =>
          prev
            .filter(
              (id) =>
                !groupedFarezonesForFilter[codespace].some(
                  (fareZone) => fareZone.id === id
                )
            )
            .concat(groupedFarezonesForFilter[codespace].map(({ id }) => id))
        );
      } else {
        setSelectedFareZones((prev: string[]) =>
          prev.filter(
            (id) =>
              !groupedFarezonesForFilter[codespace].some(
                (fareZone) => fareZone.id === id
              )
          )
        );
      }
    },
    [groupedFarezonesForFilter]
  );

  const toggleExpandCodespace = useCallback((codespace: string) => {
    setExpandedCodespace((prev: string | undefined) =>
      prev === codespace ? undefined : codespace
    );
  }, []);

  const fareZonesToDisplay = useMemo(() => {
    return fareZones
      .filter((fareZone) => selectedFareZones.includes(fareZone.id))
      .filter((fareZone) => !!fareZone.polygon);
  }, [fareZones, selectedFareZones]);

  const checkedCodespace = useCallback(
    (codespace: string) => {
      return groupedFarezonesForFilter[codespace].every((fareZone) =>
        selectedFareZones.includes(fareZone.id)
      );
    },
    [groupedFarezonesForFilter, selectedFareZones]
  );

  const indeterminateCodespace = useCallback(
    (codespace: string) => {
      return (
        groupedFarezonesForFilter[codespace].some((fareZone) =>
          selectedFareZones.includes(fareZone.id)
        ) &&
        groupedFarezonesForFilter[codespace].some(
          (fareZone) => !selectedFareZones.includes(fareZone.id)
        )
      );
    },
    [groupedFarezonesForFilter, selectedFareZones]
  );

  return (
    <>
      {show && (
        <>
          <Control
            position={position}
            style={{ backgroundColor: "white", padding: ".5rem" }}
          >
            <Typography variant="subtitle1">Fare zones</Typography>
            {fareZonesForFilter.length === 0 && <LinearProgress />}
            {fareZonesForFilter.length > 0 && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {Object.keys(groupedFarezonesForFilter).map((codespace) => (
                  <Box key={codespace} sx={{ display: "flex" }}>
                    <FormControlLabel
                      label={codespace}
                      control={
                        <Checkbox
                          ref={(elm) => (itemsRef.current[codespace] = elm)}
                          size="small"
                          onChange={(e) =>
                            toggleCodespaceSelection(
                              codespace,
                              e.target.checked
                            )
                          }
                          checked={checkedCodespace(codespace)}
                          indeterminate={indeterminateCodespace(codespace)}
                        />
                      }
                    />
                    <IconButton
                      onClick={() => toggleExpandCodespace(codespace)}
                    >
                      <ExpandMore />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Control>
          {expandedCodespace && (
            <Popover
              open
              anchorEl={() => itemsRef.current[expandedCodespace]!}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              onClose={() => toggleExpandCodespace(expandedCodespace)}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "24px",
                }}
              >
                {groupedFarezonesForFilter[expandedCodespace].map(
                  (fareZone) => (
                    <FormControlLabel
                      key={fareZone.id}
                      label={`${fareZone.name.value} - ${fareZone.privateCode.value} (${fareZone.id})`}
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedFareZones.includes(fareZone.id)}
                          onChange={(e) =>
                            toggleFareZoneSelection(
                              fareZone.id,
                              e.target.checked
                            )
                          }
                        />
                      }
                    />
                  )
                )}
              </Box>
            </Popover>
          )}
          {fareZonesToDisplay.map((fareZone: FareZone) => (
            <Polygon
              key={fareZone.id}
              positions={fareZone.polygon.coordinates}
              pathOptions={{ fillColor: "blue" }}
            />
          ))}
        </>
      )}
    </>
  );
};
