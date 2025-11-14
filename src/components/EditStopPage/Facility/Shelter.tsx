import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import equipmentHelpers from "../../../modelUtils/equipmentHelpers";
import BusShelter from "../../../static/icons/facilities/BusShelter";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { Facility as FacilityEnum, FacilityProps } from "./types";

const Shelter = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityProps) => {
  const dispatch = useDispatch();
  const isShelterPresent = equipmentHelpers.isShelterEquipmentPresent(entity);

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
    <FeatureCheckbox
      icon={<BusShelter />}
      handleFeatureStateChange={handleShelterChange}
      name={FacilityEnum.SHELTER_EQUIPMENT}
      isFeaturePresent={isShelterPresent}
    />
  );
};

export default Shelter;
