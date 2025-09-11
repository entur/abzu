import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import equiptmentHelpers from "../../../modelUtils/equipmentHelpers";
import BusShelter from "../../../static/icons/facilities/BusShelter";
import FacilityCheckbox from "./FacilityCheckbox";
import { Facility as FacilityEnum, FacilityProps } from "./types";

const Shelter = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityProps) => {
  const dispatch = useDispatch();
  const isShelterPresent = equiptmentHelpers.isShelterEquipmentPresent(entity);

  const handleShelterChange = (value: boolean) => {
    if (disabled) {
      return;
    }

    dispatch(
      EquipmentActions.updateShelterEquipmentState(
        value,
        entityType,
        id || index,
      ) as unknown as AnyAction,
    );
  };

  return (
    <FacilityCheckbox
      icon={<BusShelter />}
      handleFacilityChange={handleShelterChange}
      facilityName={FacilityEnum.SHELTER_EQUIPMENT}
      isFacilityPresent={isShelterPresent}
    />
  );
};

export default Shelter;
