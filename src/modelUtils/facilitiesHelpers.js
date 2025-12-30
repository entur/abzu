import { defaultSiteFacilitySet, MobilityFacility } from "../models/Facilities";
import { getIn } from "../utils";

const FacilitiesHelpers = {};

FacilitiesHelpers.getSiteFacilitySet = (entity) => {
  const facilities = getIn(entity, ["facilities"], []);
  return facilities?.[0];
};

FacilitiesHelpers.getMobilityFacilityList = (entity) => {
  const siteFacilitySet = FacilitiesHelpers.getSiteFacilitySet(entity);
  return siteFacilitySet?.mobilityFacilityList || [];
};

FacilitiesHelpers.isTactileGuidingStrips = (mobilityFacilityListItem) => {
  return mobilityFacilityListItem === MobilityFacility.TACTILE_GUIDING_STRIPS;
};

FacilitiesHelpers.isTactilePlatformEdges = (mobilityFacilityListItem) => {
  return mobilityFacilityListItem === MobilityFacility.TACTILE_PLATFORM_EDGES;
};

FacilitiesHelpers.isMobilityFacilityListUnknown = (
  mobilityFacilityListItem,
) => {
  return mobilityFacilityListItem === MobilityFacility.UNKNOWN;
};

/**
 * Wipe out tactiles related values from the newMobilityFacilityList array, as well as "unknown" -
 * because the moment user chooses anything in the UI menu the state of mobilityFacilityList becomes "known"
 */
FacilitiesHelpers.onTactilesUpdatedGetMobilityFacilityListCleanState = (
  mobilityFacilityList,
) => {
  return mobilityFacilityList.filter(
    (v) =>
      !FacilitiesHelpers.isTactileGuidingStrips(v) &&
      !FacilitiesHelpers.isTactilePlatformEdges(v) &&
      !FacilitiesHelpers.isMobilityFacilityListUnknown(v),
  );
};

FacilitiesHelpers.getPassengerInformationFacilityList = (entity) => {
  const siteFacilitySet = FacilitiesHelpers.getSiteFacilitySet(entity);
  return siteFacilitySet?.passengerInformationFacilityList || [];
};

FacilitiesHelpers.getPassengerInformationEquipmentList = (entity) => {
  const siteFacilitySet = FacilitiesHelpers.getSiteFacilitySet(entity);
  return siteFacilitySet?.passengerInformationEquipmentList || [];
};

FacilitiesHelpers.updateFacilitiesForEntity = (entity, payload) => {
  const updatedEntity = { ...entity };
  const { state, type, id } = payload;

  if (type === "quay") {
    const newSiteFacilitySet = entity.quays[id].facilities
      ? {
          ...entity.quays[id].facilities[0],
          ...state,
        }
      : { ...defaultSiteFacilitySet, ...state };
    updatedEntity.quays[id].facilities = [newSiteFacilitySet];
  } else {
    const newSiteFacilitySet = entity.facilities
      ? {
          ...entity.facilities[0],
          ...state,
        }
      : { ...defaultSiteFacilitySet, ...state };
    updatedEntity.facilities = [newSiteFacilitySet];
  }

  return updatedEntity;
};

export default FacilitiesHelpers;
