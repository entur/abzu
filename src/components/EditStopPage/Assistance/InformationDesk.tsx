import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { FacilityActions } from "../../../actions";
import facilitiesHelpers from "../../../modelUtils/facilitiesHelpers";
import { PassengerInformationEquipment } from "../../../models/Facilities";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { AssistanceTabItem, AssistanceTabItemProps } from "./types";

/**
 * For now is expected to be used within a stop place facilities tab only;
 * Add "index" prop if the need comes to have this under quay facilities tab as well
 */
const InformationDesk = ({
  entity,
  disabled,
  id,
  entityType,
}: AssistanceTabItemProps) => {
  const dispatch = useDispatch();
  const passengerInformationEquipmentList: PassengerInformationEquipment[] =
    facilitiesHelpers.getPassengerInformationEquipmentList(entity);
  const isInformationDeskPresent = passengerInformationEquipmentList.includes(
    PassengerInformationEquipment.INFORMATION_DESK,
  );

  const handlePassengerInformationDisplayChange = (newValue: boolean) => {
    if (disabled) {
      return;
    }
    const newPassengerInformationFacilityList = newValue
      ? [
          ...passengerInformationEquipmentList,
          PassengerInformationEquipment.INFORMATION_DESK,
        ]
      : passengerInformationEquipmentList.filter(
          (v) => v !== PassengerInformationEquipment.INFORMATION_DESK,
        );

    dispatch(
      FacilityActions.updatePassengerInformationEquipmentList(
        newPassengerInformationFacilityList,
        entityType,
        id,
      ) as unknown as AnyAction,
    );
  };

  return (
    <FeatureCheckbox
      icon={<LiveHelpIcon />}
      handleFeatureStateChange={handlePassengerInformationDisplayChange}
      name={AssistanceTabItem.INFORMATION_DESK}
      isFeaturePresent={isInformationDeskPresent}
    />
  );
};

export default InformationDesk;
