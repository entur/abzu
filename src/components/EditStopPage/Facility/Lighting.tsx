import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import facilityActions from "../../../actions/FacilityActions";
import { LightingEnum } from "../../../models/Lighting";
import { getIn } from "../../../utils";
import FeaturePopoverMenu from "../PlaceFeatures/FeaturePopoverMenu";
import {
  FeaturePopoverMenuOption,
  iconColorStates,
} from "../PlaceFeatures/types";
import { FacilityTabItem, FacilityTabItemProps } from "./types";

const wellLitOption: FeaturePopoverMenuOption<LightingEnum> = {
  value: LightingEnum.WELL_LIT,
  icon: <LightbulbIcon />,
  color: iconColorStates.TRUE,
};

const poorlyLitOption: FeaturePopoverMenuOption<LightingEnum> = {
  value: LightingEnum.POORLY_LIT,
  icon: <LightbulbIcon />,
  color: iconColorStates.PARTIAL,
};

const unlitOption: FeaturePopoverMenuOption<LightingEnum> = {
  value: LightingEnum.UNLIT,
  icon: <LightbulbIcon />,
  color: iconColorStates.FALSE,
};

const unknownOption: FeaturePopoverMenuOption<LightingEnum> = {
  value: LightingEnum.UNKNOWN,
  icon: <LightbulbIcon />,
  color: iconColorStates.UNKNOWN,
};

const otherOption: FeaturePopoverMenuOption<LightingEnum> = {
  value: LightingEnum.OTHER,
  icon: <LightbulbIcon />,
  color: iconColorStates.DEFAULT,
};

const popupMenuOptions: FeaturePopoverMenuOption<LightingEnum>[] = [
  wellLitOption,
  poorlyLitOption,
  unlitOption,
  unknownOption,
  otherOption,
];

/**
 * Quay lighting facility;
 * To be used on a quay level only, hence only using the "index" here and not "id";
 */
const Lighting = ({ entity, disabled, index }: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  // Fallback to LightningEnum.UNKNOWN as getIn may return null
  const lighting =
    getIn(entity, ["lighting"], LightingEnum.UNKNOWN) ?? LightingEnum.UNKNOWN;

  const handleChange = (newValue: LightingEnum) => {
    dispatch(
      facilityActions.updateQuayLighting(
        newValue,
        index,
      ) as unknown as UnknownAction,
    );
  };

  return (
    <FeaturePopoverMenu
      featureName={FacilityTabItem.LIGHTING}
      options={popupMenuOptions}
      disabled={disabled}
      handleChange={handleChange}
      selectedValue={lighting}
    />
  );
};

export default Lighting;
