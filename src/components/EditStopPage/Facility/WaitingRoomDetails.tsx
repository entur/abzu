import TextField from "@mui/material/TextField";
import { UnknownAction } from "@reduxjs/toolkit";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { EquipmentActions } from "../../../actions";
import StairsIcon from "../../../static/icons/accessibility/Stairs";
import Heated from "../../../static/icons/facilities/Heated";
import { getIn } from "../../../utils";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import {
  FacilityTabItemDetail,
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
  const { formatMessage } = useIntl();

  const waitingRoomKeys = ["placeEquipments", "waitingRoomEquipment"];
  const waitingRoomSeats = getIn(
    entity,
    waitingRoomKeys.concat(FacilityTabItemDetail.SEATS),
    0,
  );
  const waitingRoomHeated = getIn(
    entity,
    waitingRoomKeys.concat(FacilityTabItemDetail.HEATED),
    false,
  );
  const waitingRoomStepFree = getIn(
    entity,
    waitingRoomKeys.concat(FacilityTabItemDetail.STEP_FREE),
    false,
  );

  const handleValueForWaitingRoomChange = (
    newValue: WaitingRoomDetailFields,
  ) => {
    if ((newValue.seats as number) < 0) {
      newValue.seats = 0;
    }
    const oldValuesSet = {
      seats: getIn(
        entity,
        waitingRoomKeys.concat(FacilityTabItemDetail.SEATS),
        0,
      ),
      heated: getIn(
        entity,
        waitingRoomKeys.concat(FacilityTabItemDetail.HEATED),
        false,
      ),
      stepFree: getIn(
        entity,
        waitingRoomKeys.concat(FacilityTabItemDetail.STEP_FREE),
        false,
      ),
    };

    const newValuesSet = { ...oldValuesSet, ...newValue };
    dispatch(
      EquipmentActions.updateWaitingRoomState(
        newValuesSet,
        entityType,
        id || index,
      ) as unknown as UnknownAction,
    );
  };

  return (
    <div style={{ padding: "3px 15px" }}>
      <TextField
        label={formatMessage({ id: "number_of_seats" })}
        variant="filled"
        type="number"
        value={waitingRoomSeats}
        disabled={disabled}
        onChange={(event) => {
          handleValueForWaitingRoomChange({
            seats: event.target.value as unknown as number,
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
          <FeatureCheckbox
            icon={<StairsIcon />}
            handleFeatureStateChange={(value: boolean) =>
              handleValueForWaitingRoomChange({ stepFree: value })
            }
            name={FacilityTabItemDetail.STEP_FREE}
            isFeaturePresent={waitingRoomStepFree}
          />
          <FeatureCheckbox
            icon={<Heated />}
            handleFeatureStateChange={(value: boolean) =>
              handleValueForWaitingRoomChange({ heated: value })
            }
            name={FacilityTabItemDetail.HEATED}
            isFeaturePresent={waitingRoomHeated}
          />
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomDetails;
