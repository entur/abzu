import TextField from "@mui/material/TextField";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import StairsIcon from "../../../static/icons/accessibility/Stairs";
import EnclosedIcon from "../../../static/icons/facilities/Enclosed";
import { getIn } from "../../../utils";
import FacilityCheckbox from "./FacilityCheckbox";
import {
  FacilityDetail as FacilityDetailEnum,
  FacilityProps,
  WaitingEquipmentDetails,
} from "./types";

const ShelterDetails = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityProps) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const shelterEquipmentKeys = ["placeEquipments", "shelterEquipment"];
  const shelterSeats = getIn(
    entity,
    shelterEquipmentKeys.concat(FacilityDetailEnum.SEATS),
    0,
  );
  const shelterStepFree = getIn(
    entity,
    shelterEquipmentKeys.concat(FacilityDetailEnum.STEP_FREE),
    false,
  );
  const shelterEnclosed = getIn(
    entity,
    shelterEquipmentKeys.concat(FacilityDetailEnum.ENCLOSED),
    false,
  );

  const handleValueForShelterChange = (newValue: WaitingEquipmentDetails) => {
    if (disabled) {
      return;
    }

    if ((newValue.seats as number) < 0) {
      newValue.seats = 0;
    }
    const oldValuesSet = {
      seats: getIn(
        entity,
        shelterEquipmentKeys.concat(FacilityDetailEnum.SEATS),
        0,
      ),
      stepFree: getIn(
        entity,
        shelterEquipmentKeys.concat(FacilityDetailEnum.STEP_FREE),
        false,
      ),
      enclosed: getIn(
        entity,
        shelterEquipmentKeys.concat(FacilityDetailEnum.ENCLOSED),
        false,
      ),
    };
    const newValuesSet = { ...oldValuesSet, ...newValue };
    dispatch(
      EquipmentActions.updateShelterEquipmentState(
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
        value={shelterSeats}
        type="number"
        disabled={disabled}
        onChange={(event) => {
          handleValueForShelterChange({
            seats: event.target.value,
          });
        }}
        fullWidth={true}
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
              handleValueForShelterChange({ stepFree: value })
            }
            facilityName={FacilityDetailEnum.STEP_FREE}
            isFacilityPresent={shelterStepFree}
          />

          <FacilityCheckbox
            icon={<EnclosedIcon />}
            handleFacilityChange={(value: boolean) =>
              handleValueForShelterChange({ enclosed: value })
            }
            facilityName={FacilityDetailEnum.ENCLOSED}
            isFacilityPresent={shelterEnclosed}
          />
        </div>
      </div>
    </div>
  );
};

export default ShelterDetails;
