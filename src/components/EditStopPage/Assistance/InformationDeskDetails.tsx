import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { FacilityActions } from "../../../actions";
import facilityActions from "../../../actions/FacilityActions";
import { MobilityFacility } from "../../../models/Facilities";
import facilitiesHelpers from "../../../modelUtils/facilitiesHelpers";
import StairsIcon from "../../../static/icons/accessibility/Stairs";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import {
  AssistanceTabItemDetail,
  AssistanceTabItemProps,
  InformationDeskDetailFields,
} from "./types";

const InformationDeskDetails = ({
  entity,
  disabled,
  id,
  entityType,
}: AssistanceTabItemProps) => {
  const dispatch = useDispatch();
  const isInformationDeskStepFree =
    facilitiesHelpers.isMobilityFacilityListStepFree(entity);
  const isInformationDeskPresent =
    facilitiesHelpers.isInformationDeskPresent(entity);

  /**
   * Whether infodesk has step free access or not is determined by the presence of "stepFreeAccess" value
   * in the mobilityFacilityList, which is part of a "Facility".
   * Currently, this value is only applicable for an infodesk.
   * WARNING: if at some point stepFreeAccess becomes applicable for something else within a facility,
   * this would mean a change in how <facilities> are handled, just a relying on the first element of the facilities
   * array only would not be enough anymore
   */
  const handleStepFreeAccessChange = (
    newValue: InformationDeskDetailFields,
  ) => {
    if (disabled) {
      return;
    }

    // Step free access:
    const newMobilityFacilityList: MobilityFacility[] =
      facilitiesHelpers.onMobilityFacilityStepFreeAccessUpdateNewState(
        entity,
        newValue.stepFreeAccess,
      );

    dispatch(
      facilityActions.updateMobilityFacilityList(
        newMobilityFacilityList,
        entityType,
        id,
      ) as unknown as UnknownAction,
    );

    // The previously unavailable info desk becomes available if stepFreeAccess toggled to true:
    if (newValue.stepFreeAccess && !isInformationDeskPresent) {
      const newPassengerInformationFacilityList =
        facilitiesHelpers.onPassengerInformationEquipmentListInformationDeskUpdateNewState(
          entity,
          true,
        );

      dispatch(
        FacilityActions.updatePassengerInformationEquipmentList(
          newPassengerInformationFacilityList,
          entityType,
          id,
        ) as unknown as AnyAction,
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "3px 15px",
      }}
    >
      <FeatureCheckbox
        icon={<StairsIcon />}
        handleFeatureStateChange={(value: boolean) =>
          handleStepFreeAccessChange({ stepFreeAccess: value })
        }
        name={AssistanceTabItemDetail.STEP_FREE_ACCESS}
        isFeaturePresent={isInformationDeskStepFree}
      />
    </div>
  );
};

export default InformationDeskDetails;
