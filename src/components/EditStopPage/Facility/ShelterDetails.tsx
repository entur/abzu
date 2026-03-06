import EventSeatIcon from "@mui/icons-material/EventSeat";
import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { EquipmentActions } from "../../../actions";
import StairsIcon from "../../../static/icons/accessibility/Stairs";
import EnclosedIcon from "../../../static/icons/facilities/Enclosed";
import { getIn } from "../../../utils";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import {
  FacilityTabItemDetail,
  FacilityTabItemProps,
  WaitingRoomDetailFields,
} from "./types";

const ShelterDetails = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  const shelterEquipmentKeys = ["placeEquipments", "shelterEquipment"];
  const shelterSeats = getIn(
    entity,
    shelterEquipmentKeys.concat(FacilityTabItemDetail.SEATS),
    0,
  );
  const shelterStepFree = getIn(
    entity,
    shelterEquipmentKeys.concat(FacilityTabItemDetail.STEP_FREE),
    false,
  );
  const shelterEnclosed = getIn(
    entity,
    shelterEquipmentKeys.concat(FacilityTabItemDetail.ENCLOSED),
    false,
  );

  const handleValueForShelterChange = (newValue: WaitingRoomDetailFields) => {
    if (disabled) {
      return;
    }

    if ((newValue.seats as number) < 0) {
      newValue.seats = 0;
    }
    const oldValuesSet = {
      seats: getIn(
        entity,
        shelterEquipmentKeys.concat(FacilityTabItemDetail.SEATS),
        0,
      ),
      stepFree: getIn(
        entity,
        shelterEquipmentKeys.concat(FacilityTabItemDetail.STEP_FREE),
        false,
      ),
      enclosed: getIn(
        entity,
        shelterEquipmentKeys.concat(FacilityTabItemDetail.ENCLOSED),
        false,
      ),
    };
    const newValuesSet = { ...oldValuesSet, ...newValue };
    dispatch(
      EquipmentActions.updateShelterEquipmentState(
        newValuesSet,
        entityType,
        id || index,
      ) as unknown as UnknownAction,
    );
  };

  return (
    <div style={{ padding: "3px 15px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <FeatureCheckbox
          icon={<EventSeatIcon />}
          handleFeatureStateChange={(value: boolean) => {
            handleValueForShelterChange({
              seats: value ? 1 : 0,
            });
          }}
          name={FacilityTabItemDetail.SEATS}
          isFeaturePresent={!!shelterSeats}
        />
        <FeatureCheckbox
          icon={<EnclosedIcon />}
          handleFeatureStateChange={(value: boolean) =>
            handleValueForShelterChange({ enclosed: value })
          }
          name={FacilityTabItemDetail.ENCLOSED}
          isFeaturePresent={shelterEnclosed}
        />
      </div>
      <FeatureCheckbox
        icon={<StairsIcon />}
        handleFeatureStateChange={(value: boolean) =>
          handleValueForShelterChange({ stepFree: value })
        }
        name={FacilityTabItemDetail.STEP_FREE}
        isFeaturePresent={shelterStepFree}
      />
    </div>
  );
};

export default ShelterDetails;
