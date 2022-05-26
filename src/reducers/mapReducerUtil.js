const mergeFareZones = (arr1, arr2) => {
  const map = new Map();
  arr1.forEach((item) => map.set(item.id, item));
  arr2.forEach((item) =>
    map.set(item.nameId, { ...map.get(item.id), ...item })
  );
  return Array.from(map.values());
};

export const getStateByOperation = (state, action) => {
  switch (action.operationName) {
    case "findFareZonesForFilter":
      return Object.assign({
        ...state,
        fareZonesForFilter: action.result.data.fareZones,
      });
    case "findFareZones":
      return Object.assign({
        ...state,
        fareZones: mergeFareZones(
          state.fareZones,
          action.result.data.fareZones
        ),
      });
    default:
      return state;
  }
};
