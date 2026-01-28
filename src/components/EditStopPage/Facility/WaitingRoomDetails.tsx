import EventSeatIcon from "@mui/icons-material/EventSeat";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import StairsIcon from "../../../static/icons/accessibility/Stairs";
import Heated from "../../../static/icons/facilities/Heated";
import { getIn } from "../../../utils";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import {
  FacilityTabItemDetail as FacilityDetailEnum,
  FacilityTabItemProps,
  WaitingRoomDetailFields,
} from "./types";

const WaitingRoomDetails = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();

  const waitingRoomKeys = ["placeEquipments", "waitingRoomEquipment"];
  const waitingRoomSeats = getIn(
    entity,
    waitingRoomKeys.concat(FacilityDetailEnum.SEATS),
    0,
  );
  const waitingRoomHeated = getIn(
    entity,
    waitingRoomKeys.concat(FacilityDetailEnum.HEATED),
    false,
  );
  const waitingRoomStepFree = getIn(
    entity,
    waitingRoomKeys.concat(FacilityDetailEnum.STEP_FREE),
    false,
  );

  const handleValueForWaitingRoomChange = (
    newValue: WaitingRoomDetailFields,
  ) => {
    if (disabled) {
      return;
    }

    if ((newValue.seats as number) < 0) {
      newValue.seats = 0;
    }
    const oldValuesSet = {
      seats: getIn(entity, waitingRoomKeys.concat(FacilityDetailEnum.SEATS), 0),
      heated: getIn(
        entity,
        waitingRoomKeys.concat(FacilityDetailEnum.HEATED),
        false,
      ),
      stepFree: getIn(
        entity,
        waitingRoomKeys.concat(FacilityDetailEnum.STEP_FREE),
        false,
      ),
    };

    const newValuesSet = { ...oldValuesSet, ...newValue };
    dispatch(
      EquipmentActions.updateWaitingRoomState(
        newValuesSet,
        entityType,
        id || index,
      ) as unknown as AnyAction,
    );
  };

  return (
    <div style={{ padding: "3px 15px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <FeatureCheckbox
          icon={<EventSeatIcon />}
          handleFeatureStateChange={(value: boolean) => {
            handleValueForWaitingRoomChange({
              seats: value ? 1 : 0,
            });
          }}
          name={FacilityDetailEnum.SEATS}
          isFeaturePresent={!!waitingRoomSeats}
        />
        <FeatureCheckbox
          icon={<Heated />}
          handleFeatureStateChange={(value: boolean) =>
            handleValueForWaitingRoomChange({ heated: value })
          }
          name={FacilityDetailEnum.HEATED}
          isFeaturePresent={waitingRoomHeated}
        />
      </div>
      <FeatureCheckbox
        icon={<StairsIcon />}
        handleFeatureStateChange={(value: boolean) =>
          handleValueForWaitingRoomChange({ stepFree: value })
        }
        name={FacilityDetailEnum.STEP_FREE}
        isFeaturePresent={waitingRoomStepFree}
      />
    </div>
  );
};

export default WaitingRoomDetails;
