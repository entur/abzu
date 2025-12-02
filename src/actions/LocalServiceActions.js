import { createThunk } from "./index";
import * as types from "./Types";

const LocalServiceActions = {};

LocalServiceActions.updateAssistanceService = (state, id) => (dispatch) => {
  dispatch(
    createThunk(types.CHANGED_ASSISTANCE_SERVICE_STATE, {
      state,
      id,
    }),
  );
};

LocalServiceActions.updateAssistanceServiceAvailability =
  (state, id) => (dispatch) => {
    dispatch(
      createThunk(types.CHANGED_ASSISTANCE_SERVICE_AVAILABILITY_STATE, {
        state,
        id,
      }),
    );
  };

export default LocalServiceActions;
