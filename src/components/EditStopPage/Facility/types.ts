import { EntityType } from "../../../models/Entities";
import Quay from "../../../models/Quay";
import StopPlace from "../../../models/StopPlace";

export interface FacilityProps {
  entity: StopPlace | Quay;
  entityType: EntityType;
  disabled: boolean;
  index?: number;
  id?: string;
}

export interface WaitingEquipmentDetails {
  stepFree?: boolean;
  seats?: number | string;
  heated?: boolean;
  enclosed?: boolean;
}
