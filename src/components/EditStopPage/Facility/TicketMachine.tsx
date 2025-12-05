import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import { defaultEquipmentFacilities } from "../../../models/Equipments";
import {
  default as equipmentHelpers,
  default as EquipmentHelpers,
} from "../../../modelUtils/equipmentHelpers";
import { TicketMachine as TicketMachineIcon } from "../../../static/icons/facilities/TicketMachine";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { FacilityTabItem as FacilityEnum, FacilityTabItemProps } from "./types";

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

    const newTicketMachinesState = value
      ? defaultEquipmentFacilities[FacilityEnum.TICKET_MACHINES].isChecked
      : defaultEquipmentFacilities[FacilityEnum.TICKET_MACHINES].isUnChecked;
    const ticketingEquipment = EquipmentHelpers.getTicketingEquipment(entity);

    dispatch(
      EquipmentActions.updateTicketMachineState(
        {
          ...ticketingEquipment,
          ...newTicketMachinesState,
        },
        entityType,
        id || index,
      ) as unknown as AnyAction,
    );
  };

  return (
    <FeatureCheckbox
      isFeaturePresent={isTicketMachinePresent}
      handleFeatureStateChange={handleTicketMachineChange}
      icon={<TicketMachineIcon />}
      name={FacilityEnum.TICKET_MACHINES}
    />
  );
};

export default TicketMachine;
