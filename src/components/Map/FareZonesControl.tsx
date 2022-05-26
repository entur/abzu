import React, { useEffect, useState } from "react";
import { Polygon } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import {
  getFareZones,
  getFareZonesForFilter,
} from "../../actions/TiamatActions";
import Control from "react-leaflet-custom-control";
import { InputLabel, MenuItem, Select, LinearProgress } from "@mui/material";
import { AnyAction } from "redux";
import { ControlPosition } from "leaflet";
import { FareZone } from "../../models/FareZone";

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

  useEffect(() => {
    dispatch(
      getFareZones(
        selectedFareZones.filter(
          (id) => !fareZones.some((fareZone) => fareZone.id === id)
        )
      ) as unknown as AnyAction
    );
  }, [selectedFareZones]);

  useEffect(() => {
    if (show) {
      dispatch(getFareZonesForFilter() as unknown as AnyAction);
    }
  }, [show]);

  return (
    <>
      {show && (
        <>
          <Control
            position={position}
            style={{ backgroundColor: "white", padding: ".5rem" }}
          >
            <InputLabel id="select-fare-zones-label">
              Select fare zones
            </InputLabel>
            {fareZonesForFilter.length === 0 && <LinearProgress />}
            {fareZonesForFilter.length > 0 && (
              <Select
                variant="standard"
                multiple
                labelId="select-fare-zones-label"
                id="select-fare-zones"
                label="Fare zones"
                value={selectedFareZones}
                renderValue={(selectedFareZones: any) =>
                  fareZonesForFilter
                    .filter((fareZone) =>
                      (selectedFareZones as string[]).includes(fareZone.id)
                    )
                    .map(
                      (fareZone) =>
                        `${fareZone.id} (${fareZone.name.value} - ${fareZone.privateCode.value})`
                    )
                    .join(",")
                }
                onChange={(e: any) => setSelectedFareZones(e.target.value)}
              >
                {fareZonesForFilter.map((fareZone: any) => (
                  <MenuItem value={fareZone.id}>
                    {fareZone.id} ({fareZone.name.value} -{" "}
                    {fareZone.privateCode.value})
                  </MenuItem>
                ))}
              </Select>
            )}
          </Control>
          {fareZones
            .filter((fareZone) => selectedFareZones.includes(fareZone.id))
            .filter((fareZone) => !!fareZone.polygon)
            .map((fareZone: any) => (
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
    </>
  );
};
