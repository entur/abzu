import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import { Facility as FacilityEnum } from "../../../models/Facility";
import equiptmentHelpers from "../../../modelUtils/equipmentHelpers";
import TransportSign from "../../../static/icons/TransportSign";
import FacilityCheckbox from "./FacilityCheckbox";
import { FacilityProps } from "./types";

const GeneralSign = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityProps) => {
  const dispatch = useDispatch();
  const isSign512Present = equiptmentHelpers.is512SignEquipmentPresent(entity);

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
    <FacilityCheckbox
      isFacilityPresent={isSign512Present}
      handleFacilityChange={handle512Sign}
      icon={<TransportSign />}
      facilityName={FacilityEnum.GENERAL_SIGN}
    />
  );
};

export default GeneralSign;
