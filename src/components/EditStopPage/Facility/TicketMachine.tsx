import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import { defaultEquipmentFacilities } from "../../../models/Equipments";
import {
  default as equipmentHelpers,
  default as EquipmentHelpers,
} from "../../../modelUtils/equipmentHelpers";
import { TicketMachine as TicketMachineIcon } from "../../../static/icons/facilities/TicketMachine";
import FacilityCheckbox from "./FacilityCheckbox";
import { Facility as FacilityEnum, FacilityProps } from "./types";

const TicketMachine = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityProps) => {
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
    <FacilityCheckbox
      isFacilityPresent={isTicketMachinePresent}
      handleFacilityChange={handleTicketMachineChange}
      icon={<TicketMachineIcon />}
      facilityName={FacilityEnum.TICKET_MACHINES}
    />
  );
};

export default TicketMachine;
