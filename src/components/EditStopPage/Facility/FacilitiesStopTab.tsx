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

import { useState } from "react";
import { EntityType } from "../../../models/Entities";
import PlaceFeatures from "../PlaceFeatures/PlaceFeatures";
import GeneralSign from "./GeneralSign";
import PassengerInformationDisplay from "./PassengerInformationDisplay";
import Shelter from "./Shelter";
import ShelterDetails from "./ShelterDetails";
import TicketCounter from "./TicketCounter";
import TicketCounterDetails from "./TicketCounterDetails";
import TicketMachine from "./TicketMachine";
import TicketMachineDetails from "./TicketMachineDetails";
import TicketOffice from "./TicketOffice";
import WC from "./WC";
import WaitingRoom from "./WaitingRoom";
import WaitingRoomDetails from "./WaitingRoomDetails";
import { FacilityTabItem } from "./types";

interface Props {
  disabled: boolean;
  // TODO: StopPlace model needs to be reworked to have a proper type for this
  stopPlace: any;
}

const FacilitiesStopTab = ({ disabled, stopPlace }: Props) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const entityType: EntityType = "stopPlace";

  return (
    <div style={{ padding: 10 }}>
      <PlaceFeatures
        name={FacilityTabItem.GENERAL_SIGN}
        entityType={entityType}
        feature={
          <GeneralSign
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
      />

      <PlaceFeatures
        name={FacilityTabItem.TICKET_MACHINES}
        entityType={entityType}
        isExpanded={expandedIndex === 2}
        handleExpand={() => setExpandedIndex(2)}
        handleCollapse={() => setExpandedIndex(-1)}
        feature={
          <TicketMachine
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
        relatedFeatures={
          <TicketMachineDetails
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
      />

      <PlaceFeatures
        name={FacilityTabItem.TICKET_OFFICE}
        entityType={entityType}
        feature={
          <TicketOffice
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
      />

      <PlaceFeatures
        name={FacilityTabItem.TICKET_COUNTER}
        entityType={entityType}
        isExpanded={expandedIndex === 4}
        handleExpand={() => setExpandedIndex(4)}
        handleCollapse={() => setExpandedIndex(-1)}
        feature={
          <TicketCounter
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
        relatedFeatures={
          <TicketCounterDetails
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
      />

      <PlaceFeatures
        name={FacilityTabItem.SHELTER_EQUIPMENT}
        entityType={entityType}
        feature={
          <Shelter
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
        relatedFeatures={
          <ShelterDetails
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
        isExpanded={expandedIndex === 5}
        handleExpand={() => setExpandedIndex(5)}
        handleCollapse={() => setExpandedIndex(-1)}
      />

      <PlaceFeatures
        entityType={entityType}
        name={FacilityTabItem.SANITARY_EQUIPMENT}
        feature={
          <WC
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
      />

      <PlaceFeatures
        entityType={entityType}
        name={FacilityTabItem.WAITING_ROOM_EQUIPMENT}
        feature={
          <WaitingRoom
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
        relatedFeatures={
          <WaitingRoomDetails
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
        isExpanded={expandedIndex === 7}
        handleExpand={() => setExpandedIndex(7)}
        handleCollapse={() => setExpandedIndex(-1)}
      />

      <PlaceFeatures
        entityType={entityType}
        name={FacilityTabItem.PASSENGER_INFORMATION_DISPLAY}
        feature={
          <PassengerInformationDisplay
            entity={stopPlace}
            disabled={disabled}
            id={stopPlace.id}
            entityType={entityType}
          />
        }
      />
    </div>
  );
};

export default FacilitiesStopTab;
