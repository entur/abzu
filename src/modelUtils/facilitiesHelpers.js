import { defaultSiteFacilitySet } from "../models/Facilities";
import { getIn } from "../utils";

const FacilitiesHelpers = {};

FacilitiesHelpers.getSiteFacilitySet = (entity) => {
  const facilities = getIn(entity, ["facilities"], []);
  return facilities[0];
};

FacilitiesHelpers.getMobilityFacilityList = (entity) => {
  const siteFacilitySet = FacilitiesHelpers.getSiteFacilitySet(entity);
  return siteFacilitySet?.mobilityFacilityList || [];
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
  }

  return updatedEntity;
};

export default FacilitiesHelpers;
