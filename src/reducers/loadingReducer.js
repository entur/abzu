const initialState = {
  mapIsLoading: false,
};

export default function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case "MAP_QUERY_START":
      return { ...state, mapIsLoading: true };

    case "MAP_QUERY_END":
      return { ...state, mapIsLoading: false };

    default:
      return state;
  }
}
