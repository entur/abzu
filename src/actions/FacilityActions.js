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

FacilityActions.updatePassengerInformationFacilityList =
  (newPassengerInformationFacilityList, entityType, id) => (dispatch) => {
    dispatch(
      createThunk(types.CHANGED_PASSENGER_INFORMATION_FACILITY_LIST_STATE, {
        state: {
          passengerInformationFacilityList: newPassengerInformationFacilityList,
        },
        type: entityType,
        id,
      }),
    );
  };

FacilityActions.updatePassengerInformationEquipmentList =
  (newPassengerInformationEquipmentList, entityType, id) => (dispatch) => {
    dispatch(
      createThunk(types.CHANGED_PASSENGER_INFORMATION_EQUIPMENT_LIST_STATE, {
        state: {
          passengerInformationEquipmentList:
            newPassengerInformationEquipmentList,
        },
        type: entityType,
        id,
      }),
    );
  };

FacilityActions.updateQuayLighting = (lighting, index) => (dispatch) => {
  dispatch(
    createThunk(types.CHANGED_QUAY_LIGHTING, {
      lighting,
      index,
    }),
  );
};

export default FacilityActions;
