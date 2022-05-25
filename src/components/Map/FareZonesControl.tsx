import React, { useEffect, useState } from "react";
import { Polygon, TileLayer } from "react-leaflet";
import { useDispatch } from "react-redux";
import {
  getFareZones,
  getFareZonesProviders,
} from "../../actions/TiamatActions";
import Control from "react-leaflet-custom-control";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { AnyAction } from "redux";
import { ControlPosition } from "leaflet";

export interface FareZonesLayerProps {
  show: boolean;
  position: ControlPosition;
}

export const FareZonesControl: React.FC<FareZonesLayerProps> = ({
  show,
  position,
}) => {
  const [fareZones, setFareZones] = useState<any[]>([]);
  const [codespaces, setCodespaces] = useState<string[]>([]);
  const [selectedCodespace, setSelectedCodespace] = useState<string | null>(
    null
  );
  const [selectedFareZones, setSelectedFareZones] = useState<any[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFareZonesProviders = async () => {
      const response: any = await dispatch(
        getFareZonesProviders() as unknown as AnyAction
      );
      setCodespaces(response.data.fareZonesProviders);
    };
    fetchFareZonesProviders();
  }, []);

  useEffect(() => {
    const fetchFareZones = async () => {
      const response: any = await dispatch(
        getFareZones(`${selectedCodespace}:FareZone`) as unknown as AnyAction
      );

      setFareZones(response.data.fareZones);
    };
    if (selectedCodespace !== null) {
      fetchFareZones();
    }
  }, [selectedCodespace]);

  return (
    <>
      {show && (
        <>
          <Control
            position={position}
            style={{ backgroundColor: "white", padding: ".5rem" }}
          >
            <div style={{ paddingBottom: ".5rem" }}>
              <InputLabel id="select-codespace-label">
                Select codespace
              </InputLabel>
              <Select
                labelId="select-codespace-label"
                id="select-codespace"
                label="Codespace"
                value={selectedCodespace}
                onChange={(e: any) => setSelectedCodespace(e.target.value)}
              >
                {codespaces.map((codespace) => (
                  <MenuItem key={codespace} value={codespace}>
                    {codespace}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <InputLabel id="select-fare-zones-label">
              Select fare zones
            </InputLabel>
            <Select
              multiple
              labelId="select-fare-zones-label"
              id="select-fare-zones"
              label="Fare zones"
              value={selectedFareZones}
              renderValue={(selectedFareZones: any) =>
                fareZones
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
              {fareZones &&
                fareZones.map((fareZone: any) => (
                  <MenuItem value={fareZone.id}>
                    {fareZone.id} ({fareZone.name.value} -{" "}
                    {fareZone.privateCode.value})
                  </MenuItem>
                ))}
            </Select>
          </Control>
          {fareZones
            .filter((fareZone) => selectedFareZones.includes(fareZone.id))
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
