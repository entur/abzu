import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { LocalServiceActions } from "../../../actions";
import LocalServicesHelpers from "../../../modelUtils/localServicesHelpers";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { AssistanceTabItem, AssistanceTabItemProps } from "./types";

/**
 * Handles AssistanceService's assistanceFacilityList field;
 * The idea is that in UI we don't go into detail what kind of assistance is available,
 * just yes or no;
 * Note: assistance service is meant to be defined only on a stop place level.
 * @param entity
 * @param disabled
 * @param id
 * @constructor
 */
const AssistanceService = ({
  entity,
  disabled,
  id,
}: AssistanceTabItemProps) => {
  const dispatch = useDispatch();
  const isAssistanceServicePresent =
    LocalServicesHelpers.isAssistanceServicePresent(entity);

  const handleAssistanceServiceFacilityChange = (value: boolean) => {
    if (disabled) {
      return;
    }
    dispatch(
      LocalServiceActions.updateAssistanceService(
        value,
        id,
      ) as unknown as UnknownAction,
    );
  };

  return (
    <FeatureCheckbox
      isFeaturePresent={isAssistanceServicePresent}
      handleFeatureStateChange={handleAssistanceServiceFacilityChange}
      icon={<EmojiPeopleIcon />}
      name={AssistanceTabItem.ASSISTANCE_SERVICE}
    />
  );
};

export default AssistanceService;
