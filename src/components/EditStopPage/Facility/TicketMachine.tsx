import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { EquipmentActions } from "../../../actions";
import {
  default as equipmentHelpers,
  default as EquipmentHelpers,
} from "../../../modelUtils/equipmentHelpers";
import { TicketMachine as TicketMachineIcon } from "../../../static/icons/facilities/TicketMachine";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { FacilityTabItem, FacilityTabItemProps } from "./types";

const TicketMachine = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  const isTicketMachinePresent =
    equipmentHelpers.isTicketMachinePresent(entity);

  const handleTicketMachineChange = (value: boolean) => {
    if (disabled) {
      return;
    }

    const newTicketingEquipmentState =
      EquipmentHelpers.getNewTicketingEquipmentStateOnTicketMachinesUpdate(
        entity,
        value,
      );

    dispatch(
      EquipmentActions.updateTicketMachineState(
        newTicketingEquipmentState,
        entityType,
        id || index,
      ) as unknown as UnknownAction,
    );
  };

  return (
    <FeatureCheckbox
      isFeaturePresent={isTicketMachinePresent}
      handleFeatureStateChange={handleTicketMachineChange}
      icon={<TicketMachineIcon />}
      name={FacilityTabItem.TICKET_MACHINES}
    />
  );
};

export default TicketMachine;
