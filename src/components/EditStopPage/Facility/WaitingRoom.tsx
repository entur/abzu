import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import equipmentHelpers from "../../../modelUtils/equipmentHelpers";
import { WaitingRoom as WaitingRoomIcon } from "../../../static/icons/facilities/WaitingRoom";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { Facility as FacilityEnum, FacilityProps } from "./types";

const WaitingRoom = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityProps) => {
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
      ) as unknown as AnyAction,
    );
  };

  return (
    <FeatureCheckbox
      icon={<WaitingRoomIcon />}
      handleFeatureStateChange={handleWaitingRoomChange}
      name={FacilityEnum.WAITING_ROOM_EQUIPMENT}
      isFeaturePresent={isWaitingRoomPresent}
    />
  );
};

export default WaitingRoom;
