/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import EventSeatIcon from "@mui/icons-material/EventSeat";
import type { FacilityTabItemProps } from "../../../EditStopPage/Facility/types";
import StairsIcon from "../../../../static/icons/accessibility/Stairs";
import BusShelter from "../../../../static/icons/facilities/BusShelter";
import EnclosedIcon from "../../../../static/icons/facilities/Enclosed";
import Heated from "../../../../static/icons/facilities/Heated";
import { WaitingRoom as WaitingRoomIcon } from "../../../../static/icons/facilities/WaitingRoom";
import {
  EquipmentDetailDefinition,
  EquipmentDetailsPanel,
} from "./EquipmentDetailsPanel";
import { EquipmentPresenceCheckbox } from "./EquipmentPresenceCheckbox";

const SHELTER_DETAILS: EquipmentDetailDefinition[] = [
  { field: "seats", icon: <EventSeatIcon /> },
  { field: "enclosed", icon: <EnclosedIcon /> },
  { field: "stepFree", icon: <StairsIcon /> },
];

const WAITING_ROOM_DETAILS: EquipmentDetailDefinition[] = [
  { field: "seats", icon: <EventSeatIcon /> },
  { field: "heated", icon: <Heated /> },
  { field: "stepFree", icon: <StairsIcon /> },
];

/** Shelter and waiting room rows for the modern facilities tab (F-25). */
export const ShelterPresence = (props: FacilityTabItemProps) => (
  <EquipmentPresenceCheckbox
    {...props}
    equipmentKey="shelterEquipment"
    icon={<BusShelter />}
  />
);

export const ShelterDetails = (props: FacilityTabItemProps) => (
  <EquipmentDetailsPanel
    {...props}
    equipmentKey="shelterEquipment"
    details={SHELTER_DETAILS}
  />
);

export const WaitingRoomPresence = (props: FacilityTabItemProps) => (
  <EquipmentPresenceCheckbox
    {...props}
    equipmentKey="waitingRoomEquipment"
    icon={<WaitingRoomIcon />}
  />
);

export const WaitingRoomDetails = (props: FacilityTabItemProps) => (
  <EquipmentDetailsPanel
    {...props}
    equipmentKey="waitingRoomEquipment"
    details={WAITING_ROOM_DETAILS}
  />
);
