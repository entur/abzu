import CountertopsIcon from "@mui/icons-material/Countertops";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import { defaultEquipmentFacilities } from "../../../models/Equipments";
import {
  default as equipmentHelpers,
  default as EquipmentHelpers,
} from "../../../modelUtils/equipmentHelpers";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { Facility as FacilityEnum, FacilityProps } from "./types";

const TicketCounter = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityProps) => {
  const dispatch = useDispatch();
  const isTicketCounterPresent =
    equipmentHelpers.isTicketCounterPresent(entity);

  const handleTicketCounterChange = (value: boolean) => {
    if (disabled) {
      return;
    }

    const newTicketCounterState = value
      ? defaultEquipmentFacilities[FacilityEnum.TICKET_COUNTER].isChecked
      : defaultEquipmentFacilities[FacilityEnum.TICKET_COUNTER].isUnChecked;
    const ticketingEquipment = EquipmentHelpers.getTicketingEquipment(entity);
    const updatedTicketingEquipment = {
      ...ticketingEquipment,
      ...newTicketCounterState,
    };

    dispatch(
      EquipmentActions.updateTicketCounterState(
        {
          ...updatedTicketingEquipment,
        },
        entityType,
        id || index,
      ) as unknown as AnyAction,
    );
  };

  return (
    <FeatureCheckbox
      isFeaturePresent={isTicketCounterPresent}
      handleFeatureStateChange={handleTicketCounterChange}
      icon={<CountertopsIcon />}
      name={FacilityEnum.TICKET_COUNTER}
    />
  );
};

export default TicketCounter;
