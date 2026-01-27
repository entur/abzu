import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { EquipmentActions } from "../../../actions";
import equipmentHelpers from "../../../modelUtils/equipmentHelpers";
import TransportSign from "../../../static/icons/TransportSign";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { FacilityTabItem, FacilityTabItemProps } from "./types";

const GeneralSign = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  const isSign512Present = equipmentHelpers.is512SignEquipmentPresent(entity);

  const handle512Sign = (value: boolean) => {
    if (disabled) {
      return;
    }
    dispatch(
      EquipmentActions.update512SignState(
        value,
        entityType,
        id || index,
      ) as unknown as UnknownAction,
    );
  };

  return (
    <FeatureCheckbox
      isFeaturePresent={isSign512Present}
      handleFeatureStateChange={handle512Sign}
      icon={<TransportSign />}
      name={FacilityTabItem.GENERAL_SIGN}
    />
  );
};

export default GeneralSign;
