import { EntityType } from "../../../models/Entities";
import Quay from "../../../models/Quay";
import StopPlace from "../../../models/StopPlace";

/**
 * In UI appears as a row in the facilities tab;
 * In some cases it covers an item from model/Equipment type fully (e.g. shelterEquipment, waitingRoomEquipment),
 * and in some the focus goes on a subset of it (e.g. ticket machines/counter as part of ticket equipment, or wc part of sanitary equipment)
 */
export enum FacilityTabItem {
  TICKET_MACHINES = "ticketMachines",
  TICKET_OFFICE = "ticketOffice",
  TICKET_COUNTER = "ticketCounter",
  SHELTER_EQUIPMENT = "shelterEquipment",
  WC = "wc",
  WAITING_ROOM_EQUIPMENT = "waitingRoomEquipment",
  GENERAL_SIGN = "generalSign",
  WALKING_SURFACE_INDICATORS = "mobilityFacility_tactile",
  PASSENGER_INFORMATION_DISPLAY = "passengerInformationDisplay",
  LIGHTING = "lighting",
}

/**
 * In UI appears as additional fields shown upon expanding a row containing FacilityTabItem
 */
export enum FacilityTabItemDetail {
  STEP_FREE = "stepFree",
  SEATS = "seats",
  ENCLOSED = "enclosed",
  HEATED = "heated",
  NUMBER_OF_MACHINES = "numberOfMachines",
  AUDIO_INTERFACE_AVAILABLE = "audioInterfaceAvailable",
  TACTILE_INTERFACE_AVAILABLE = "tactileInterfaceAvailable",
  INDUCTION_LOOPS = "inductionLoops",
  LOW_COUNTER_ACCESS = "lowCounterAccess",
  WHEELCHAIR_ACCESSIBLE_TOILET = "wheelChairAccessToilet",
  WHEELCHAIR_SUITABLE = "wheelchairSuitable",
}

/**
 * Re-used between all facilities, whether on stop place or quay level;
 * id is relevant for a stop place, while index is for quay
 */
export interface FacilityTabItemProps {
  entity: StopPlace | Quay;
  entityType: EntityType;
  disabled: boolean;
  index?: number;
  id?: string;
}

export interface WaitingRoomDetailFields {
  stepFree?: boolean;
  seats?: number;
  heated?: boolean;
  enclosed?: boolean;
}

export interface TicketMachineDetailFields {
  numberOfMachines?: number;
  audioInterfaceAvailable?: boolean;
  tactileInterfaceAvailable?: boolean;
  wheelchairSuitable?: boolean;
}

export interface TicketCounterDetailFields {
  inductionLoops?: boolean;
  lowCounterAccess?: boolean;
}

export interface WCDetailFields {
  isWheelchairAccessible?: boolean;
}
