import { createThunk } from ".";
import {
  getUserPermissions,
  getLocationPermissionsForCoordinates,
} from "./TiamatActions";
import * as types from "./Types";

export const updateAuth = (auth) => (dispatch) => {
  dispatch(createThunk(types.UPDATED_AUTH, auth));
};

export const fetchUserPermissions = () => (dispatch, getState) => {
  dispatch(getUserPermissions());
};

export const fetchLocationPermissions = (position) => (dispatch) => {
  dispatch(getLocationPermissionsForCoordinates(position[1], position[0]));
};
