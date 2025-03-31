import { ExpandMore } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Popover,
  Typography,
} from "@mui/material";
import { ControlPosition } from "leaflet";
import { useCallback, useMemo, useRef, useState } from "react";
import Control from "react-leaflet-custom-control";
import { TariffZone } from "../../models/TariffZone";

export interface ZonesControlProps<T extends TariffZone> {
  position: ControlPosition;
  title: string;
  zonesForFilter: T[];
  selectedZones: string[];
  setSelectedZones: (ids: string[]) => void;
  getZoneLabel: (zone: T) => string;
}

export const ZonesControl = <T extends TariffZone>({
  position,
  title,
  zonesForFilter,
  selectedZones,
  setSelectedZones,
  getZoneLabel,
}: ZonesControlProps<T>) => {
  const itemsRef = useRef<Record<string, HTMLButtonElement | null>>({});

  const [expandedCodespace, setExpandedCodespace] = useState<
    string | undefined
  >();

  const groupedZonesForFilter = useMemo(() => {
    return zonesForFilter.reduce((acc: Record<string, T[]>, next: T) => {
      const codespace = next.id.split(":")[0];
      acc[codespace] ? acc[codespace].push(next) : (acc[codespace] = [next]);
      return acc;
    }, {});
  }, [zonesForFilter]);

  const sortedCodespaces = useMemo(() => {
    return Object.keys(groupedZonesForFilter).sort();
  }, [groupedZonesForFilter]);

  const toggleCodespaceSelection = useCallback(
    (codespace: string, checked: boolean) => {
      if (checked) {
        setSelectedZones(
          selectedZones
            .filter(
              (id) =>
                !groupedZonesForFilter[codespace].some(
                  (zone) => zone.id === id,
                ),
            )
            .concat(groupedZonesForFilter[codespace].map(({ id }) => id)),
        );
      } else {
        setSelectedZones(
          selectedZones.filter(
            (id) =>
              !groupedZonesForFilter[codespace].some((zone) => zone.id === id),
          ),
        );
      }
    },
    [groupedZonesForFilter, selectedZones],
  );

  const checkedCodespace = useCallback(
    (codespace: string) => {
      return groupedZonesForFilter[codespace].every((fareZone) =>
        selectedZones.includes(fareZone.id),
      );
    },
    [groupedZonesForFilter, selectedZones],
  );

  const indeterminateCodespace = useCallback(
    (codespace: string) => {
      return (
        groupedZonesForFilter[codespace].some((fareZone) =>
          selectedZones.includes(fareZone.id),
        ) &&
        groupedZonesForFilter[codespace].some(
          (fareZone) => !selectedZones.includes(fareZone.id),
        )
      );
    },
    [groupedZonesForFilter, selectedZones],
  );

  const toggleExpandCodespace = useCallback((codespace: string) => {
    setExpandedCodespace((prev: string | undefined) =>
      prev === codespace ? undefined : codespace,
    );
  }, []);

  const toggleFareZoneSelection = useCallback(
    (id: string, checked: boolean) => {
      setSelectedZones(
        checked
          ? selectedZones.concat([id])
          : selectedZones.filter((selected) => selected !== id),
      );
    },
    [selectedZones],
  );

  return (
    <>
      <Control
        position={position}
        container={{ style: { backgroundColor: "white", padding: ".5rem" } }}
      >
        <Typography variant="subtitle1">{title}</Typography>
        {zonesForFilter.length === 0 && <LinearProgress />}
        {zonesForFilter.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {sortedCodespaces.map((codespace) => (
              <Box key={codespace} sx={{ display: "flex" }}>
                <FormControlLabel
                  label={codespace}
                  control={
                    <Checkbox
                      ref={(elm) => {
                        itemsRef.current[codespace] = elm;
                      }}
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
            {groupedZonesForFilter[expandedCodespace].map((zone) => (
              <FormControlLabel
                key={zone.id}
                label={getZoneLabel(zone)}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedZones.includes(zone.id)}
                    onChange={(e) =>
                      toggleFareZoneSelection(zone.id, e.target.checked)
                    }
                  />
                }
              />
            ))}
          </Box>
        </Popover>
      )}
    </>
  );
};
