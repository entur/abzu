import DvrIcon from "@mui/icons-material/Dvr";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { FacilityActions } from "../../../actions";
import facilitiesHelpers from "../../../modelUtils/facilitiesHelpers";
import { PassengerInformationFacility } from "../../../models/Facilities";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { FacilityTabItem, FacilityTabItemProps } from "./types";

/**
 * For now is expected to be used within a stop place facilities tab only;
 * Add "index" prop if the need comes to have this under quay facilities tab as well
 */
const PassengerInformationDisplay = ({
  entity,
  disabled,
  id,
  entityType,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  const passengerInformationFacilityList: PassengerInformationFacility[] =
    facilitiesHelpers.getPassengerInformationFacilityList(entity);
  const isPassengerInformationDisplayPresent =
    passengerInformationFacilityList.includes(
      PassengerInformationFacility.PASSENGER_INFORMATION_DISPLAY,
    );

  const handlePassengerInformationDisplayChange = (newValue: boolean) => {
    if (disabled) {
      return;
    }
    const newPassengerInformationFacilityList = newValue
      ? [
          ...passengerInformationFacilityList,
          PassengerInformationFacility.PASSENGER_INFORMATION_DISPLAY,
        ]
      : passengerInformationFacilityList.filter(
          (v) =>
            v !== PassengerInformationFacility.PASSENGER_INFORMATION_DISPLAY,
        );

    dispatch(
      FacilityActions.updatePassengerInformationFacilityList(
        newPassengerInformationFacilityList,
        entityType,
        id,
      ) as unknown as AnyAction,
    );
  };

  return (
    <FeatureCheckbox
      icon={<DvrIcon />}
      handleFeatureStateChange={handlePassengerInformationDisplayChange}
      name={FacilityTabItem.PASSENGER_INFORMATION_DISPLAY}
      isFeaturePresent={isPassengerInformationDisplayPresent}
    />
  );
};

export default PassengerInformationDisplay;
