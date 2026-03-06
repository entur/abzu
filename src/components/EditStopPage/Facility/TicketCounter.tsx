import CountertopsIcon from "@mui/icons-material/Countertops";
import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { EquipmentActions } from "../../../actions";
import { defaultEquipmentFacilities } from "../../../models/Equipments";
import {
  default as equipmentHelpers,
  default as EquipmentHelpers,
} from "../../../modelUtils/equipmentHelpers";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { FacilityTabItem, FacilityTabItemProps } from "./types";

const TicketCounter = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  const isTicketCounterPresent =
    equipmentHelpers.isTicketCounterPresent(entity);

  const handleTicketCounterChange = (value: boolean) => {
    if (disabled) {
      return;
    }

    const newTicketCounterState = value
      ? defaultEquipmentFacilities[FacilityTabItem.TICKET_COUNTER].isChecked
      : defaultEquipmentFacilities[FacilityTabItem.TICKET_COUNTER].isUnChecked;
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
      ) as unknown as UnknownAction,
    );
  };

  return (
    <FeatureCheckbox
      isFeaturePresent={isTicketCounterPresent}
      handleFeatureStateChange={handleTicketCounterChange}
      icon={<CountertopsIcon />}
      name={FacilityTabItem.TICKET_COUNTER}
    />
  );
};

export default TicketCounter;
