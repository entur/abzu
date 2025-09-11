import MdWc from "@mui/icons-material/Wc";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import equiptmentHelpers from "../../../modelUtils/equipmentHelpers";
import FacilityCheckbox from "./FacilityCheckbox";
import { Facility as FacilityEnum, FacilityProps } from "./types";

const WC = ({ entity, disabled, id, index, entityType }: FacilityProps) => {
  const dispatch = useDispatch();
  const isWCPresent = equiptmentHelpers.isSanitaryEquipmentPresent(entity);

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
    <FacilityCheckbox
      isFacilityPresent={isWCPresent}
      handleFacilityChange={handleWCChange}
      icon={<MdWc />}
      facilityName={FacilityEnum.SANITARY_EQUIPMENT}
    />
  );
};

export default WC;
