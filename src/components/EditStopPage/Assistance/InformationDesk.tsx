import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { FacilityActions } from "../../../actions";
import facilityActions from "../../../actions/FacilityActions";
import facilitiesHelpers from "../../../modelUtils/facilitiesHelpers";
import { MobilityFacility } from "../../../models/Facilities";
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
  const isInformationDeskPresent =
    facilitiesHelpers.isInformationDeskPresent(entity);

  const handlePassengerInformationDisplayChange = (newValue: boolean) => {
    if (disabled) {
      return;
    }
    const newPassengerInformationFacilityList =
      facilitiesHelpers.onPassengerInformationEquipmentListInformationDeskUpdateNewState(
        entity,
        newValue,
      );

    dispatch(
      FacilityActions.updatePassengerInformationEquipmentList(
        newPassengerInformationFacilityList,
        entityType,
        id,
      ) as unknown as AnyAction,
    );

    /**
     * If infodesk becomes unavailable, its step free access feature also needs to be gone.
     * WARNING: if at some point stepFreeAccess becomes applicable for something else within a facility,
     * this would mean a change in how <facilities> are handled, just relying on the first element of the facilities
     * array only would not be enough anymore
     */
    if (!newValue && facilitiesHelpers.isMobilityFacilityListStepFree(entity)) {
      const newMobilityFacilityList: MobilityFacility[] =
        facilitiesHelpers.onMobilityFacilityStepFreeAccessUpdateNewState(
          entity,
          false,
        );

      dispatch(
        facilityActions.updateMobilityFacilityList(
          newMobilityFacilityList,
          entityType,
          id,
        ) as unknown as UnknownAction,
      );
    }
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
