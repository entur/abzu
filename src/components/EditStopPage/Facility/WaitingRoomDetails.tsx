import TextField from "@mui/material/TextField";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import StairsIcon from "../../../static/icons/accessibility/Stairs";
import Heated from "../../../static/icons/facilities/Heated";
import { getIn } from "../../../utils";
import FacilityCheckbox from "./FacilityCheckbox";
import {
  FacilityDetail as FacilityDetailEnum,
  FacilityProps,
  WaitingEquipmentDetails,
} from "./types";

const WaitingRoomDetails = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityProps) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

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
    newValue: WaitingEquipmentDetails,
  ) => {
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
    <div>
      <TextField
        label={formatMessage({ id: "number_of_seats" })}
        variant="filled"
        type="number"
        value={waitingRoomSeats}
        disabled={disabled}
        onChange={(event) => {
          handleValueForWaitingRoomChange({
            seats: event.target.value,
          });
        }}
        fullWidth={true}
        InputLabelProps={{ shrink: true }}
      />
      <div style={{ display: "block" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <FacilityCheckbox
            icon={<StairsIcon />}
            handleFacilityChange={(value: boolean) =>
              handleValueForWaitingRoomChange({ stepFree: value })
            }
            facilityName={FacilityDetailEnum.STEP_FREE}
            isFacilityPresent={waitingRoomStepFree}
          />
          <FacilityCheckbox
            icon={<Heated />}
            handleFacilityChange={(value: boolean) =>
              handleValueForWaitingRoomChange({ heated: value })
            }
            facilityName={FacilityDetailEnum.HEATED}
            isFacilityPresent={waitingRoomHeated}
          />
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomDetails;
