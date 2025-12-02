import PowerInputIcon from "@mui/icons-material/PowerInput";
import { UnknownAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import facilityActions from "../../../actions/FacilityActions";
import FacilitiesHelpers from "../../../modelUtils/facilitiesHelpers";
import { MobilityFacility } from "../../../models/Facilities";
import FeaturePopoverMenu from "../PlaceFeatures/FeaturePopoverMenu";
import {
  FeaturePopoverMenuDefaults,
  FeaturePopoverMenuOption,
  FeaturePopoverMenuValue,
  iconColorStates,
} from "../PlaceFeatures/types";
import { FacilityTabItem, FacilityTabItemProps } from "./types";

const allTactileIndicatorsOption: FeaturePopoverMenuOption = {
  value: FeaturePopoverMenuDefaults.ALL,
  icon: <PowerInputIcon />,
  color: iconColorStates.TRUE,
};

const tactilePlatformEdgesOption: FeaturePopoverMenuOption = {
  value: MobilityFacility.TACTILE_PLATFORM_EDGES,
  icon: <PowerInputIcon />,
  color: iconColorStates.PARTIAL,
};

const tactileGuidingStripsOption: FeaturePopoverMenuOption = {
  value: MobilityFacility.TACTILE_GUIDING_STRIPS,
  icon: <PowerInputIcon />,
  color: iconColorStates.PARTIAL,
};

const noTactileIndicatorsOption: FeaturePopoverMenuOption = {
  value: FeaturePopoverMenuDefaults.NONE,
  icon: <PowerInputIcon />,
  color: iconColorStates["NONE"],
};

const getMenuSelectedValue = (mobilityFacilityList: MobilityFacility[]) => {
  const isTactilePlatformEdgesAvailable = mobilityFacilityList.includes(
    MobilityFacility.TACTILE_PLATFORM_EDGES,
  );
  const isTactileGuidingStripsAvailable = mobilityFacilityList.includes(
    MobilityFacility.TACTILE_GUIDING_STRIPS,
  );

  if (isTactilePlatformEdgesAvailable && isTactileGuidingStripsAvailable) {
    return FeaturePopoverMenuDefaults.ALL;
  }
  if (isTactilePlatformEdgesAvailable) {
    return MobilityFacility.TACTILE_PLATFORM_EDGES;
  }
  if (isTactileGuidingStripsAvailable) {
    return MobilityFacility.TACTILE_GUIDING_STRIPS;
  }

  return FeaturePopoverMenuDefaults.NONE;
};

/**
 * Platform's tactile features;
 * To be used on a quay level only, hence only using the "index" here and not "id";
 */
const WalkingSurfaceIndicators = ({
  entity,
  disabled,
  entityType,
  index,
}: FacilityTabItemProps) => {
  const dispatch = useDispatch();
  const mobilityFacilityList: MobilityFacility[] =
    FacilitiesHelpers.getMobilityFacilityList(entity);
  const menuSelectedValue = getMenuSelectedValue(mobilityFacilityList);
  const popupMenuOptions: FeaturePopoverMenuOption[] = [
    allTactileIndicatorsOption,
    tactilePlatformEdgesOption,
    tactileGuidingStripsOption,
    noTactileIndicatorsOption,
  ];

  const handleChange = (newValue: FeaturePopoverMenuValue) => {
    const newMobilityFacilityList: MobilityFacility[] =
      mobilityFacilityList.filter(
        (v) =>
          !(
            // Wipe out tactiles related values from the newMobilityFacilityList array:
            (
              v === MobilityFacility.TACTILE_GUIDING_STRIPS ||
              v === MobilityFacility.TACTILE_PLATFORM_EDGES ||
              // Clean-up the "unknown" value in case new value is something other than "none", basically meaning the state isn't "unknown" anymore:
              (newValue !== FeaturePopoverMenuDefaults.NONE &&
                v === MobilityFacility.UNKNOWN)
            )
          ),
      );

    if (newValue === MobilityFacility.TACTILE_GUIDING_STRIPS) {
      newMobilityFacilityList.push(MobilityFacility.TACTILE_GUIDING_STRIPS);
    } else if (newValue === MobilityFacility.TACTILE_PLATFORM_EDGES) {
      newMobilityFacilityList.push(MobilityFacility.TACTILE_PLATFORM_EDGES);
    } else if (newValue == FeaturePopoverMenuDefaults.ALL) {
      newMobilityFacilityList.push(MobilityFacility.TACTILE_GUIDING_STRIPS);
      newMobilityFacilityList.push(MobilityFacility.TACTILE_PLATFORM_EDGES);
    }
    // and if newValue is FeaturePopoverMenuDefaults.NONE - then just keeping the tactile related values wiped out, if they were there at all

    dispatch(
      facilityActions.updateMobilityFacilityList(
        newMobilityFacilityList,
        entityType,
        index,
      ) as unknown as UnknownAction,
    );
  };

  return (
    <FeaturePopoverMenu
      featureName={FacilityTabItem.WALKING_SURFACE_INDICATORS}
      options={popupMenuOptions}
      disabled={disabled}
      handleChange={handleChange}
      selectedValue={menuSelectedValue}
    />
  );
};

export default WalkingSurfaceIndicators;
