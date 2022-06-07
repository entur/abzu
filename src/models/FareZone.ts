import { TariffZone } from "./TariffZone";

export interface FareZone extends TariffZone {
  privateCode: {
    value: string;
  };
}
