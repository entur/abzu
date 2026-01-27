import MdWc from "@mui/icons-material/Wc";
import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { EquipmentActions } from "../../../actions";
import equipmentHelpers from "../../../modelUtils/equipmentHelpers";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { FacilityTabItem, FacilityTabItemProps } from "./types";

const WC = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  const isWCPresent = equipmentHelpers.isWCPresent(entity);

  const handleWCChange = (value: boolean) => {
    if (disabled) {
      return;
    }

    const newSanitaryEquipmentState =
      equipmentHelpers.getNewSanitaryEquipmentStateOnWCUpdate(entity, value);

    dispatch(
      EquipmentActions.updateWCState(
        newSanitaryEquipmentState,
        entityType,
        id || index,
      ) as unknown as UnknownAction,
    );
  };

  return (
    <FeatureCheckbox
      isFeaturePresent={isWCPresent}
      handleFeatureStateChange={handleWCChange}
      icon={<MdWc />}
      name={FacilityTabItem.WC}
    />
  );
};

export default WC;
