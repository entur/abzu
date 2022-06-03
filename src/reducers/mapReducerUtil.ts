import { ApolloQueryResult } from "../actions";
import { FareZone } from "../models/FareZone";
import { MapState } from "./mapReducer";

const mergeFareZones = (arr1: FareZone[], arr2: FareZone[]) => {
  const map = new Map();
  arr1.forEach((item) => map.set(item.id, item));
  arr2.forEach((item) => map.set(item.id, { ...map.get(item.id), ...item }));
  return Array.from(map.values());
};

const sortByPrivateCode = (a: FareZone, b: FareZone) => {
  if (a.privateCode.value > b.privateCode.value) {
    return 1;
  } else if (b.privateCode.value > a.privateCode.value) {
    return -1;
  } else {
    return 0;
  }
};

export const getStateByOperation = (
  state: MapState,
  action: ApolloQueryResult
) => {
  switch (action.operationName) {
    case "findFareZonesForFilter":
      return Object.assign({
        ...state,
        fareZonesForFilter: action.result.data.fareZones
          .slice()
          .sort(sortByPrivateCode),
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
