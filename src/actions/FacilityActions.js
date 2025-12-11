import { createThunk } from "./index";
import * as types from "./Types";

const FacilityActions = {};

FacilityActions.updateMobilityFacilityList =
  (newMobilityFacilityList, entityType, id) => (dispatch) => {
    dispatch(
      createThunk(types.CHANGED_MOBILITY_FACILITY_LIST_STATE, {
        state: { mobilityFacilityList: newMobilityFacilityList },
        type: entityType,
        id,
      }),
    );
  };

export default FacilityActions;
