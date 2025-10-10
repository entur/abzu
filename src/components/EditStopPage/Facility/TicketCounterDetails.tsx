import WheelChair from "@mui/icons-material/Accessible";
import HearingIcon from "@mui/icons-material/Hearing";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import EquipmentHelpers from "../../../modelUtils/equipmentHelpers";
import { getIn } from "../../../utils";
import FacilityCheckbox from "./FacilityCheckbox";
import {
  FacilityDetail as FacilityDetailEnum,
  FacilityProps,
  TicketCounterDetailFields,
} from "./types";

const TicketCounterDetails = ({
  index,
  id,
  entity,
  disabled,
  entityType,
}: FacilityProps) => {
  const dispatch = useDispatch();
  const ticketingEquipmentKeys = ["placeEquipments", "ticketingEquipment"];

  const inductionLoopsAvailable = getIn(
    entity,
    ticketingEquipmentKeys.concat(FacilityDetailEnum.INDUCTION_LOOPS),
    false,
  );
  const lowCounterAccessAvailable = getIn(
    entity,
    ticketingEquipmentKeys.concat(FacilityDetailEnum.LOW_COUNTER_ACCESS),
    false,
  );

  const handleValueForTicketCounterChange = (
    newValue: TicketCounterDetailFields,
  ) => {
    if (disabled) {
      return;
    }

    const ticketingEquipment = EquipmentHelpers.getTicketingEquipment(entity);
    const updatedTicketingEquipment = {
      ...ticketingEquipment,
      ...newValue,
    };

    if (
      !updatedTicketingEquipment.ticketCounter &&
      (updatedTicketingEquipment.inductionLoops ||
        updatedTicketingEquipment.lowCounterAccess)
    ) {
      updatedTicketingEquipment.ticketCounter = true;
    }

    dispatch(
      EquipmentActions.updateTicketMachineState(
        {
          ...updatedTicketingEquipment,
        },
        entityType,
        id || index,
      ) as unknown as AnyAction,
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "3px 15px",
      }}
    >
      <FacilityCheckbox
        icon={<HearingIcon />}
        handleFacilityChange={(value: boolean) =>
          handleValueForTicketCounterChange({
            inductionLoops: value,
          })
        }
        facilityName={FacilityDetailEnum.INDUCTION_LOOPS}
        isFacilityPresent={inductionLoopsAvailable}
      />
      <FacilityCheckbox
        icon={<WheelChair />}
        handleFacilityChange={(value: boolean) =>
          handleValueForTicketCounterChange({
            lowCounterAccess: value,
          })
        }
        facilityName={FacilityDetailEnum.LOW_COUNTER_ACCESS}
        isFacilityPresent={lowCounterAccessAvailable}
      />
    </div>
  );
};

export default TicketCounterDetails;
