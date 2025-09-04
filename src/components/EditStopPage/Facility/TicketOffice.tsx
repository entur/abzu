import BusinessIcon from "@mui/icons-material/Business";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import { defaultEquipmentFacilities } from "../../../models/Equipments";
import { Facility as FacilityEnum } from "../../../models/Facility";
import {
  default as equipmentHelpers,
  default as EquipmentHelpers,
} from "../../../modelUtils/equipmentHelpers";
import FacilityCheckbox from "./FacilityCheckbox";
import { FacilityProps } from "./types";

const TicketOffice = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityProps) => {
  const dispatch = useDispatch();
  const isTicketOfficePresent = equipmentHelpers.isTicketOfficePresent(entity);

  const handleTicketOfficeChange = (value: boolean) => {
    if (disabled) {
      return;
    }

    const newTicketMachinesState = value
      ? defaultEquipmentFacilities[FacilityEnum.TICKET_OFFICE].isChecked
      : defaultEquipmentFacilities[FacilityEnum.TICKET_OFFICE].isUnChecked;
    const ticketingEquipment = EquipmentHelpers.getTicketingEquipment(entity);

    dispatch(
      EquipmentActions.updateTicketOfficeState(
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
      isFacilityPresent={isTicketOfficePresent}
      handleFacilityChange={handleTicketOfficeChange}
      icon={<BusinessIcon />}
      facilityName={FacilityEnum.TICKET_OFFICE}
    />
  );
};

export default TicketOffice;
