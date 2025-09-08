import { EntityType } from "../../../models/Entities";
import Quay from "../../../models/Quay";
import StopPlace from "../../../models/StopPlace";

export enum Facility {
  TICKET_MACHINES = "ticketMachines",
  TICKET_OFFICE = "ticketOffice",
  SHELTER_EQUIPMENT = "shelterEquipment",
  SANITARY_EQUIPMENT = "sanitaryEquipment",
  WAITING_ROOM_EQUIPMENT = "waitingRoomEquipment",
  GENERAL_SIGN = "generalSign",
}

export enum FacilityDetail {
  STEP_FREE = "stepFree",
  SEATS = "seats",
  ENCLOSED = "enclosed",
  HEATED = "heated",
}

/**
 * Re-used between all facilities, whether on stop place or quay level;
 * id is relevant for a stop place, while index is for quay
 */
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
