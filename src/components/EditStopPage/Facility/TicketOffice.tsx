import BusinessIcon from "@mui/icons-material/Business";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import { defaultEquipmentFacilities } from "../../../models/Equipments";
import {
  default as equipmentHelpers,
  default as EquipmentHelpers,
} from "../../../modelUtils/equipmentHelpers";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { FacilityTabItem as FacilityEnum, FacilityTabItemProps } from "./types";

const TicketOffice = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  const isTicketOfficePresent = equipmentHelpers.isTicketOfficePresent(entity);

  const handleTicketOfficeChange = (value: boolean) => {
    if (disabled) {
      return;
    }

    const newTicketOfficeState = value
      ? defaultEquipmentFacilities[FacilityEnum.TICKET_OFFICE].isChecked
      : defaultEquipmentFacilities[FacilityEnum.TICKET_OFFICE].isUnChecked;
    const ticketingEquipment = EquipmentHelpers.getTicketingEquipment(entity);

    dispatch(
      EquipmentActions.updateTicketOfficeState(
        {
          ...ticketingEquipment,
          ...newTicketOfficeState,
        },
        entityType,
        id || index,
      ) as unknown as AnyAction,
    );
  };

  return (
    <FeatureCheckbox
      isFeaturePresent={isTicketOfficePresent}
      handleFeatureStateChange={handleTicketOfficeChange}
      icon={<BusinessIcon />}
      name={FacilityEnum.TICKET_OFFICE}
    />
  );
};

export default TicketOffice;
