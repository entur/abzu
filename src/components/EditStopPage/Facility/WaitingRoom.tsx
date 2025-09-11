import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import equiptmentHelpers from "../../../modelUtils/equipmentHelpers";
import { WaitingRoom as WaitingRoomIcon } from "../../../static/icons/facilities/WaitingRoom";
import FacilityCheckbox from "./FacilityCheckbox";
import { Facility as FacilityEnum, FacilityProps } from "./types";

const WaitingRoom = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityProps) => {
  const dispatch = useDispatch();
  const isWaitingRoomPresent = equiptmentHelpers.isWaitingRoomPresent(entity);

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
    <FacilityCheckbox
      icon={<WaitingRoomIcon />}
      handleFacilityChange={handleWaitingRoomChange}
      facilityName={FacilityEnum.WAITING_ROOM_EQUIPMENT}
      isFacilityPresent={isWaitingRoomPresent}
    />
  );
};

export default WaitingRoom;
