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

import React from "react";
import { connect } from "react-redux";
import { Facility as FacilityEnum } from "../../../models/Facility";
import ErsadItem from "../ErsadItem";
import GeneralSign from "./GeneralSign";
import Shelter from "./Shelter";
import ShelterDetails from "./ShelterDetails";
import TicketMachine from "./TicketMachine";
import TicketMachineDetails from "./TicketMachineDetails";
import TicketOffice from "./TicketOffice";
import WC from "./WC";
import WaitingRoom from "./WaitingRoom";
import WaitingRoomDetails from "./WaitingRoomDetails";

class FacilitiesQuayTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedIndex: -1,
    };
  }

  setExpandedIndex(newIndex) {
    this.setState({
      expandedIndex: newIndex,
    });
  }

  render() {
    const { index, disabled, quay } = this.props;
    const { expandedIndex } = this.state;
    const entityType = "quay";

    return (
      <div style={{ padding: 10 }}>
        <ErsadItem
          name={FacilityEnum.GENERAL_SIGN}
          entityType={entityType}
          item={
            <GeneralSign
              entity={quay}
              disabled={disabled}
              index={index}
              entityType={entityType}
            />
          }
        />

        <ErsadItem
          name={FacilityEnum.TICKET_MACHINES}
          entityType={entityType}
          isExpanded={expandedIndex === 2}
          handleExpand={() => this.setExpandedIndex(2)}
          handleCollapse={() => this.setExpandedIndex(-1)}
          item={
            <TicketMachine
              entity={quay}
              disabled={disabled}
              index={index}
              entityType={entityType}
            />
          }
          relatedItems={
            <TicketMachineDetails
              entity={quay}
              disabled={disabled}
              index={index}
              entityType={entityType}
            />
          }
        />

        <ErsadItem
          name={FacilityEnum.TICKET_OFFICE}
          entityType={entityType}
          item={
            <TicketOffice
              entity={quay}
              disabled={disabled}
              index={index}
              entityType={entityType}
            />
          }
        />

        <ErsadItem
          name={FacilityEnum.SHELTER_EQUIPMENT}
          entityType={entityType}
          item={
            <Shelter
              entity={quay}
              disabled={disabled}
              index={index}
              entityType={entityType}
            />
          }
          relatedItems={
            <ShelterDetails
              entity={quay}
              disabled={disabled}
              index={index}
              entityType={entityType}
            />
          }
          isExpanded={expandedIndex === 4}
          handleExpand={() => this.setExpandedIndex(4)}
          handleCollapse={() => this.setExpandedIndex(-1)}
        />

        <ErsadItem
          entityType={entityType}
          name={FacilityEnum.SANITARY_EQUIPMENT}
          item={
            <WC
              entity={quay}
              disabled={disabled}
              index={index}
              entityType={entityType}
            />
          }
        />

        <ErsadItem
          entityType={entityType}
          name={FacilityEnum.WAITING_ROOM_EQUIPMENT}
          item={
            <WaitingRoom
              entity={quay}
              disabled={disabled}
              index={index}
              entityType={entityType}
            />
          }
          relatedItems={
            <WaitingRoomDetails
              entity={quay}
              disabled={disabled}
              index={index}
              entityType={entityType}
            />
          }
          handleExpand={() => this.setExpandedIndex(6)}
          handleCollapse={() => this.setExpandedIndex(-1)}
        />
      </div>
    );
  }
}

export default connect(null)(FacilitiesQuayTab);
