import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";
import { LocalServiceActions } from "../../../actions";
import LocalServicesHelpers from "../../../modelUtils/localServicesHelpers";
import FeatureCheckbox from "../PlaceFeatures/FeatureCheckbox";
import { AssistanceProps, AssistanceTabItem } from "./types";

/**
 * Handles AssistanceService's assistanceFacilityList field;
 * The idea is that in UI we don't go into detail what kind of assistance is available,
 * just yes or no;
 * @param entity
 * @param disabled
 * @param id
 * @constructor
 */
const AssistanceService = ({ entity, disabled, id }: AssistanceProps) => {
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
        "stopPlace",
        id,
      ) as unknown as AnyAction,
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
