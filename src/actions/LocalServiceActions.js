import { createThunk } from "./index";
import * as types from "./Types";

const LocalServiceActions = {};

LocalServiceActions.updateAssistanceService =
  (state, entityType, id) => (dispatch) => {
    dispatch(
      createThunk(types.CHANGED_ASSISTANCE_SERVICE_STATE, {
        state,
        type: entityType,
        id,
      }),
    );
  };

LocalServiceActions.updateAssistanceServiceAvailability =
  (state, entityType, id) => (dispatch) => {
    dispatch(
      createThunk(types.CHANGED_ASSISTANCE_SERVICE_AVAILABILITY_STATE, {
        state,
        type: entityType,
        id,
      }),
    );
  };

export default LocalServiceActions;
