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

import { ComponentType, useState } from "react";
import GeneralSign from "../../../EditStopPage/Facility/GeneralSign";
import Lighting from "../../../EditStopPage/Facility/Lighting";
import PassengerInformationDisplay from "../../../EditStopPage/Facility/PassengerInformationDisplay";
import TicketCounter from "../../../EditStopPage/Facility/TicketCounter";
import TicketCounterDetails from "../../../EditStopPage/Facility/TicketCounterDetails";
import TicketMachine from "../../../EditStopPage/Facility/TicketMachine";
import TicketMachineDetails from "../../../EditStopPage/Facility/TicketMachineDetails";
import TicketOffice from "../../../EditStopPage/Facility/TicketOffice";
import {
  FacilityTabItem,
  FacilityTabItemProps,
} from "../../../EditStopPage/Facility/types";
import WalkingSurfaceIndicators from "../../../EditStopPage/Facility/WalkingSurfaceIndicators";
import WC from "../../../EditStopPage/Facility/WC";
import WCDetails from "../../../EditStopPage/Facility/WCDetails";
import PlaceFeatures from "../../../EditStopPage/PlaceFeatures/PlaceFeatures";
import {
  ShelterDetails,
  ShelterPresence,
  WaitingRoomDetails,
  WaitingRoomPresence,
} from "./describedEquipment";

interface FacilityRow {
  name: FacilityTabItem;
  Feature: ComponentType<FacilityTabItemProps>;
  Details?: ComponentType<FacilityTabItemProps>;
}

/** Same rows and order as the classic tabs; shelter and waiting room are modern. */
const SHARED_ROWS: FacilityRow[] = [
  { name: FacilityTabItem.GENERAL_SIGN, Feature: GeneralSign },
  {
    name: FacilityTabItem.TICKET_MACHINES,
    Feature: TicketMachine,
    Details: TicketMachineDetails,
  },
  { name: FacilityTabItem.TICKET_OFFICE, Feature: TicketOffice },
  {
    name: FacilityTabItem.TICKET_COUNTER,
    Feature: TicketCounter,
    Details: TicketCounterDetails,
  },
  {
    name: FacilityTabItem.SHELTER_EQUIPMENT,
    Feature: ShelterPresence,
    Details: ShelterDetails,
  },
  { name: FacilityTabItem.WC, Feature: WC, Details: WCDetails },
  {
    name: FacilityTabItem.WAITING_ROOM_EQUIPMENT,
    Feature: WaitingRoomPresence,
    Details: WaitingRoomDetails,
  },
];

const ROWS_BY_ENTITY: Record<"stopPlace" | "quay", FacilityRow[]> = {
  stopPlace: [
    ...SHARED_ROWS,
    {
      name: FacilityTabItem.PASSENGER_INFORMATION_DISPLAY,
      Feature: PassengerInformationDisplay,
    },
  ],
  quay: [
    ...SHARED_ROWS,
    {
      name: FacilityTabItem.WALKING_SURFACE_INDICATORS,
      Feature: WalkingSurfaceIndicators,
    },
    { name: FacilityTabItem.LIGHTING, Feature: Lighting },
  ],
};

const NONE_EXPANDED = -1;
const TAB_PADDING = 10;

type ModernFacilitiesTabProps = Omit<FacilityTabItemProps, "entityType"> & {
  entityType: "stopPlace" | "quay";
};

/**
 * The facilities tab of the modern editor, for a stop (by id) or a quay (by
 * index). It reuses the classic rows, except shelter and waiting room, which
 * no longer save made-up details when ticked (F-25).
 */
export const ModernFacilitiesTab = (props: ModernFacilitiesTabProps) => {
  const [expandedIndex, setExpandedIndex] = useState(NONE_EXPANDED);
  const { entityType } = props;

  return (
    <div style={{ padding: TAB_PADDING }}>
      {ROWS_BY_ENTITY[entityType].map(
        ({ name, Feature, Details }, rowIndex) => (
          <PlaceFeatures
            key={name}
            name={name}
            entityType={entityType}
            feature={<Feature {...props} />}
            {...(Details && {
              relatedFeatures: <Details {...props} />,
              isExpanded: expandedIndex === rowIndex,
              handleExpand: () => setExpandedIndex(rowIndex),
              handleCollapse: () => setExpandedIndex(NONE_EXPANDED),
            })}
          />
        ),
      )}
    </div>
  );
};
