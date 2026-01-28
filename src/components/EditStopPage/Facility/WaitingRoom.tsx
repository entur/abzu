import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { EquipmentActions } from "../../../actions";
import equipmentHelpers from "../../../modelUtils/equipmentHelpers";
import { WaitingRoom as WaitingRoomIcon } from "../../../static/icons/facilities/WaitingRoom";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { FacilityTabItem, FacilityTabItemProps } from "./types";

const WaitingRoom = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  const isWaitingRoomPresent = equipmentHelpers.isWaitingRoomPresent(entity);

  const handleWaitingRoomChange = (value: boolean) => {
    if (disabled) {
      return;
    }
    dispatch(
      EquipmentActions.updateWaitingRoomState(
        value,
        entityType,
        id || index,
      ) as unknown as UnknownAction,
    );
  };

  return (
    <FeatureCheckbox
      icon={<WaitingRoomIcon />}
      handleFeatureStateChange={handleWaitingRoomChange}
      name={FacilityTabItem.WAITING_ROOM_EQUIPMENT}
      isFeaturePresent={isWaitingRoomPresent}
    />
  );
};

export default WaitingRoom;
