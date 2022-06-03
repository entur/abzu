import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Polygon } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import {
  getFareZones,
  getFareZonesForFilter,
} from "../../actions/TiamatActions";
import Control from "react-leaflet-custom-control";
import {
  InputLabel,
  MenuItem,
  Select,
  LinearProgress,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
  DialogActions,
  IconButton,
  Typography,
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
  const [expandedCodespaces, setExpandedCodespaces] = useState<string[]>([]);
  const [selectedFareZones, setSelectedFareZones] = useState<string[]>([]);
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

  const [showDialog, setShowDialog] = useState(false);

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
    [expandedCodespaces, groupedFarezonesForFilter]
  );

  const toggleExpandCodespace = useCallback((codespace: string) => {
    setExpandedCodespaces((prev: string[]) =>
      prev.includes(codespace)
        ? prev.filter((id) => id !== codespace)
        : [...prev, codespace]
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
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {fareZonesForFilter.length > 0 && (
                <>
                  <Box sx={{ maxHeight: "25rem", overflow: "hidden" }}>
                    {fareZonesToDisplay.map((fareZone) => (
                      <Box>{`${fareZone.name.value} - ${fareZone.privateCode.value} (${fareZone.id})`}</Box>
                    ))}
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setShowDialog(true)}
                  >
                    Select fare zones
                  </Button>
                </>
              )}
            </Box>
          </Control>
          {fareZonesToDisplay.map((fareZone: any) => (
            <Polygon
              key={fareZone.id}
              positions={[
                fareZone.polygon.coordinates.map((lnglat: number[]) =>
                  lnglat.slice().reverse()
                ),
              ]}
              pathOptions={{ fillColor: "blue" }}
            />
          ))}
        </>
      )}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} fullWidth>
        <DialogTitle>Select fare zones</DialogTitle>
        <DialogContent>
          {Object.keys(groupedFarezonesForFilter).map((codespace) => (
            <>
              <FormControlLabel
                label={codespace}
                control={
                  <Checkbox
                    size="small"
                    onChange={(e) =>
                      toggleCodespaceSelection(codespace, e.target.checked)
                    }
                    checked={checkedCodespace(codespace)}
                    indeterminate={indeterminateCodespace(codespace)}
                  />
                }
              />
              <IconButton onClick={() => toggleExpandCodespace(codespace)}>
                <ExpandMore />
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "24px",
                }}
              >
                {expandedCodespaces.includes(codespace) &&
                  groupedFarezonesForFilter[codespace].map((fareZone) => (
                    <FormControlLabel
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
                  ))}
              </Box>
            </>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
