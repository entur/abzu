import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import equipmentHelpers from "../../../modelUtils/equipmentHelpers";
import TransportSign from "../../../static/icons/TransportSign";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { FacilityTabItem as FacilityEnum, FacilityTabItemProps } from "./types";

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
      ) as unknown as AnyAction,
    );
  };

  return (
    <FeatureCheckbox
      isFeaturePresent={isSign512Present}
      handleFeatureStateChange={handle512Sign}
      icon={<TransportSign />}
      name={FacilityEnum.GENERAL_SIGN}
    />
  );
};

export default GeneralSign;
