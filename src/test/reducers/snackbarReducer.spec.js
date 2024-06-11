import rolesReducer, { initialState, getErrorMsg } from '../../reducers/snackbarReducer';
import {
  APOLLO_MUTATION_ERROR,
  ERROR,
  OPENED_SNACKBAR,
  DISMISSED_SNACKBAR,
} from '../../actions/Types';

describe('rolesReducer', () => {
  it('should return the initial state when state is undefined', () => {
    expect(rolesReducer(undefined, {})).toEqual(initialState);
  });

  it('should return initial state for an unknown action type', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
    };
    expect(rolesReducer(initialState, action)).toEqual(initialState);
  });

  it('should handle APOLLO_MUTATION_ERROR', () => {
    const action = {
      type: APOLLO_MUTATION_ERROR,
      error: [{ message: 'Error' }],
    };
    const expectedState = {
      snackbarOptions: {
        isOpen: true,
        status: ERROR,
        errorMsg: 'Error',
      },
    };
    expect(rolesReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle APOLLO_MUTATION_ERROR with null error', () => {
    const action = {
      type: APOLLO_MUTATION_ERROR,
      error: null,
    };
    const expectedState = {
      snackbarOptions: {
        isOpen: true,
        status: ERROR,
        errorMsg: null,
      },
    };
    expect(rolesReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle OPENED_SNACKBAR', () => {
    const action = {
      type: OPENED_SNACKBAR,
      payload: {
        status: 'Success',
      },
    };
    const expectedState = {
      snackbarOptions: {
        isOpen: true,
        status: 'Success',
        errorMsg: null,
      },
    };
    expect(rolesReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DISMISSED_SNACKBAR', () => {
    const initialStateWithOpenSnackbar = {
      snackbarOptions: {
        isOpen: true,
        message: 'This is a short message',
        status: 'Success',
      },
    };
    const action = {
      type: DISMISSED_SNACKBAR,
    };
    const expectedState = {
      snackbarOptions: {
        isOpen: false,
      },
    };
    expect(rolesReducer(initialStateWithOpenSnackbar, action)).toEqual(expectedState);
  });
});
