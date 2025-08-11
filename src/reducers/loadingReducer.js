const initialState = {
  localIsLoading: false,
  globalIsLoading: false,
};

export default function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case "MAP_QUERY_START":
      return { ...state, localIsLoading: true };
    case "MAP_QUERY_END":
      return { ...state, localIsLoading: false };
    case "GLOBAL_LOADING_START":
      return { ...state, globalIsLoading: true };
    case "GLOBAL_LOADING_END":
      return { ...state, globalIsLoading: false };

    default:
      return state;
  }
}
