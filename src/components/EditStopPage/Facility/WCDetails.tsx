import WheelChair from "@mui/icons-material/Accessible";
import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
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
  FacilityTabItem,
  FacilityTabItemDetail,
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
  const sanitaryEquipment = EquipmentHelpers.getSanitaryEquipment(entity);
  const isWCPresent = equipmentHelpers.isWCPresent(entity);
  const sanitaryFacilityList = EquipmentHelpers.getSanitaryFacilityList(entity);
  const isWheelchairAccessible: boolean =
    EquipmentHelpers.isWCWheelchairAccessible(entity);

  const handleValueForWCChange = (newValue: WCDetailFields) => {
    let newSanitaryEquipment;
    if (!isWCPresent && newValue.isWheelchairAccessible) {
      newSanitaryEquipment =
        defaultEquipmentFacilities[FacilityTabItem.WC].isChecked;
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
      EquipmentActions.updateWCState(
        newSanitaryEquipment,
        entityType,
        id || index,
      ) as unknown as UnknownAction,
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
        name={FacilityTabItemDetail.WHEELCHAIR_ACCESSIBLE_TOILET}
        isFeaturePresent={isWheelchairAccessible}
      />
    </div>
  );
};

export default WCDetails;
