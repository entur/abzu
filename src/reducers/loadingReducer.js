const initialState = {
  mapIsLoading: false,
};

export default function loadingReducer(state = initialState, action) {
  switch (action.type) {
    // This action will be dispatched just BEFORE the map query is sent
    case "MAP_QUERY_START":
      return { ...state, mapIsLoading: true };

    // This action will be dispatched AFTER the map query is finished (success or fail)
    case "MAP_QUERY_END":
      return { ...state, mapIsLoading: false };

    default:
      return state;
  }
}
