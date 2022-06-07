import React from "react";
import {
  getFareZones,
  getFareZonesForFilter,
} from "../../actions/TiamatActions";
import { ControlPosition } from "leaflet";
import { FareZone } from "../../models/FareZone";
import { Zones } from "./Zones";

export interface FareZonesProps {
  position: ControlPosition;
}

const getColorByCodespace = (codespace: string) => {
  switch (codespace) {
    case "ATB":
      return "5F464B";
    case "MOR":
      return "8E4A49";
    case "BRA":
      return "7DAA92";
    case "VOT":
      return "80FFEC";
    case "SKY":
      return "C2FBEF";
    case "INN":
      return "6D545D";
    case "AKT":
      return "756D54";
    case "KOL":
      return "8B9556";
    case "TRO":
      return "ABB557";
    case "RUT":
      return "BED558";
    case "OST":
      return "7AFDD6";
    case "NOR":
      return "77FF94";
    case "FIN":
      return "A1E44D";
    default:
      return "fff";
  }
};

export const FareZones: React.FC<FareZonesProps> = ({ position }) => {
  return (
    <Zones<FareZone>
      controlPosition={position}
      controlTitle="Fare zones"
      getZoneLabel={(fareZone: FareZone) =>
        `${fareZone.name.value} - ${fareZone.privateCode.value} (${fareZone.id})`
      }
      getZoneColor={(fareZone) =>
        getColorByCodespace(fareZone.id.split(":")[0])
      }
      showSelector={(state) => state.mapUtils.showFareZones}
      zonesForFilterSelector={(state) => state.mapUtils.fareZonesForFilter}
      zonesSelector={(state) => state.mapUtils.fareZones}
      getZonesForFilterAction={getFareZonesForFilter}
      getZonesAction={getFareZones}
    />
  );
};
