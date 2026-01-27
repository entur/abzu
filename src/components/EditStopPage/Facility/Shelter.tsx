import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { EquipmentActions } from "../../../actions";
import equipmentHelpers from "../../../modelUtils/equipmentHelpers";
import BusShelter from "../../../static/icons/facilities/BusShelter";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { FacilityTabItem, FacilityTabItemProps } from "./types";

const Shelter = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityTabItemProps) => {
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
      ) as unknown as UnknownAction,
    );
  };

  return (
    <FeatureCheckbox
      icon={<BusShelter />}
      handleFeatureStateChange={handleShelterChange}
      name={FacilityTabItem.SHELTER_EQUIPMENT}
      isFeaturePresent={isShelterPresent}
    />
  );
};

export default Shelter;
