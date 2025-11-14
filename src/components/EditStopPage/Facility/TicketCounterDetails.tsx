import WheelChair from "@mui/icons-material/Accessible";
import HearingIcon from "@mui/icons-material/Hearing";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import EquipmentHelpers from "../../../modelUtils/equipmentHelpers";
import { getIn } from "../../../utils";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
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
      <FeatureCheckbox
        icon={<HearingIcon />}
        handleFeatureStateChange={(value: boolean) =>
          handleValueForTicketCounterChange({
            inductionLoops: value,
          })
        }
        name={FacilityDetailEnum.INDUCTION_LOOPS}
        isFeaturePresent={inductionLoopsAvailable}
      />
      <FeatureCheckbox
        icon={<WheelChair />}
        handleFeatureStateChange={(value: boolean) =>
          handleValueForTicketCounterChange({
            lowCounterAccess: value,
          })
        }
        name={FacilityDetailEnum.LOW_COUNTER_ACCESS}
        isFeaturePresent={lowCounterAccessAvailable}
      />
    </div>
  );
};

export default TicketCounterDetails;
