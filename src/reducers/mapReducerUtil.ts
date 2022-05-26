import { ApolloQueryResult } from "../actions";
import { FareZone } from "../models/FareZone";
import { MapState } from "./mapReducer";

const mergeFareZones = (arr1: FareZone[], arr2: FareZone[]) => {
  const map = new Map();
  arr1.forEach((item) => map.set(item.id, item));
  arr2.forEach((item) => map.set(item.id, { ...map.get(item.id), ...item }));
  return Array.from(map.values());
};

export const getStateByOperation = (
  state: MapState,
  action: ApolloQueryResult
) => {
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
