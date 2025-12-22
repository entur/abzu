import WheelChair from "@mui/icons-material/Accessible";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { EquipmentActions } from "../../../actions";
import {
  defaultEquipmentFacilities,
  SanitaryFacility,
} from "../../../models/Equipments";
import {
  default as EquipmentHelpers,
  default as equipmentHelpers,
} from "../../../modelUtils/equipmentHelpers";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import {
  FacilityTabItemDetail as FacilityDetailEnum,
  FacilityTabItem as FacilityEnum,
  FacilityTabItemProps,
  WCDetailFields,
} from "./types";

const WCDetails = ({
  entity,
  disabled,
  id,
  index,
  entityType,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  const sanitaryEquipment =
    EquipmentHelpers.getSanitaryEquipmentPresent(entity);
  const isWCPresent = equipmentHelpers.isSanitaryEquipmentPresent(entity);
  const sanitaryFacilityList = EquipmentHelpers.getSanitaryFacilityList(entity);
  const isWheelchairAccessible: boolean =
    EquipmentHelpers.isSanitaryFacilityWheelchairAccessible(entity);

  const handleValueForWCChange = (newValue: WCDetailFields) => {
    let newSanitaryEquipment;
    if (!isWCPresent && newValue.isWheelchairAccessible) {
      newSanitaryEquipment =
        defaultEquipmentFacilities[FacilityEnum.SANITARY_EQUIPMENT].isChecked;
    } else {
      newSanitaryEquipment = {
        ...sanitaryEquipment,
      };
    }

    let newSanitaryFacilityList;
    if (newValue.isWheelchairAccessible) {
      newSanitaryFacilityList = [...sanitaryFacilityList];
      newSanitaryFacilityList.push(SanitaryFacility.WHEEL_CHAIR_ACCESS_TOILET);
    } else {
      newSanitaryFacilityList = sanitaryFacilityList.filter(
        (f: SanitaryFacility) =>
          f !== SanitaryFacility.WHEEL_CHAIR_ACCESS_TOILET,
      );
    }
    newSanitaryEquipment.sanitaryFacilityList = newSanitaryFacilityList;

    dispatch(
      EquipmentActions.updateSanitaryState(
        newSanitaryEquipment,
        entityType,
        id || index,
      ) as unknown as AnyAction,
    );
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "3px 15px",
      }}
    >
      <FeatureCheckbox
        icon={<WheelChair />}
        handleFeatureStateChange={(value: boolean) =>
          handleValueForWCChange({ isWheelchairAccessible: value })
        }
        name={FacilityDetailEnum.WHEELCHAIR_ACCESSIBLE_TOILET}
        isFeaturePresent={isWheelchairAccessible}
      />
    </div>
  );
};

export default WCDetails;
