import MdWc from "@mui/icons-material/Wc";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import equipmentHelpers from "../../../modelUtils/equipmentHelpers";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { FacilityTabItem as FacilityEnum, FacilityTabItemProps } from "./types";

const WC = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  const isWCPresent = equipmentHelpers.isSanitaryEquipmentPresent(entity);

  const handleWCChange = (value: boolean) => {
    if (disabled) {
      return;
    }

    dispatch(
      EquipmentActions.updateSanitaryState(
        value,
        entityType,
        id || index,
      ) as unknown as AnyAction,
    );
  };

  return (
    <FeatureCheckbox
      isFeaturePresent={isWCPresent}
      handleFeatureStateChange={handleWCChange}
      icon={<MdWc />}
      name={FacilityEnum.SANITARY_EQUIPMENT}
    />
  );
};

export default WC;
