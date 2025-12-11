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
import Quay from "../../../models/Quay";
import PlaceFeatures from "../PlaceFeatures/PlaceFeatures";
import GeneralSign from "./GeneralSign";
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
import WalkingSurfaceIndicators from "./WalkingSurfaceIndicators";
import { FacilityTabItem as FacilityEnum } from "./types";

interface Props {
  disabled: boolean;
  quay: Quay;
  index: number;
}

const FacilitiesQuayTab = ({ disabled, quay, index }: Props) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const entityType: EntityType = "quay";

  return (
    <div style={{ padding: 10 }}>
      <PlaceFeatures
        name={FacilityEnum.GENERAL_SIGN}
        entityType={entityType}
        feature={
          <GeneralSign
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
      />

      <PlaceFeatures
        name={FacilityEnum.TICKET_MACHINES}
        entityType={entityType}
        isExpanded={expandedIndex === 2}
        handleExpand={() => setExpandedIndex(2)}
        handleCollapse={() => setExpandedIndex(-1)}
        feature={
          <TicketMachine
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
        relatedFeatures={
          <TicketMachineDetails
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
      />

      <PlaceFeatures
        name={FacilityEnum.TICKET_OFFICE}
        entityType={entityType}
        feature={
          <TicketOffice
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
      />

      <PlaceFeatures
        name={FacilityEnum.TICKET_COUNTER}
        entityType={entityType}
        isExpanded={expandedIndex === 4}
        handleExpand={() => setExpandedIndex(4)}
        handleCollapse={() => setExpandedIndex(-1)}
        feature={
          <TicketCounter
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
        relatedFeatures={
          <TicketCounterDetails
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
      />

      <PlaceFeatures
        name={FacilityEnum.SHELTER_EQUIPMENT}
        entityType={entityType}
        feature={
          <Shelter
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
        relatedFeatures={
          <ShelterDetails
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
        isExpanded={expandedIndex === 5}
        handleExpand={() => setExpandedIndex(5)}
        handleCollapse={() => setExpandedIndex(-1)}
      />

      <PlaceFeatures
        entityType={entityType}
        name={FacilityEnum.SANITARY_EQUIPMENT}
        feature={
          <WC
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
      />

      <PlaceFeatures
        entityType={entityType}
        name={FacilityEnum.WAITING_ROOM_EQUIPMENT}
        feature={
          <WaitingRoom
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
        relatedFeatures={
          <WaitingRoomDetails
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
        isExpanded={expandedIndex === 7}
        handleExpand={() => setExpandedIndex(7)}
        handleCollapse={() => setExpandedIndex(-1)}
      />

      <PlaceFeatures
        entityType={entityType}
        name={FacilityEnum.WALKING_SURFACE_INDICATORS}
        feature={
          <WalkingSurfaceIndicators
            entity={quay}
            disabled={disabled}
            index={index}
            entityType={entityType}
          />
        }
      />
    </div>
  );
};

export default FacilitiesQuayTab;
