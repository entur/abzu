import { Box } from "@mui/material";
import { Polygon, Tooltip } from "react-leaflet";
import { TariffZone } from "../../models/TariffZone";

export interface ZonesLayerProps<T extends TariffZone> {
  zones: T[];
  getTooltipText: (zone: T) => string;
  getColor: (zone: T) => string;
}

export const ZonesLayer = <T extends TariffZone>({
  zones,
  getTooltipText,
  getColor,
}: ZonesLayerProps<T>) => {
  return (
    <>
      {zones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.polygon.coordinates}
          pathOptions={{
            fillColor: `#${getColor(zone)}`,
            color: `#${getColor(zone)}`,
          }}
        >
          <Tooltip>
            <Box>{getTooltipText(zone)}</Box>
          </Tooltip>
        </Polygon>
      ))}
    </>
  );
};
