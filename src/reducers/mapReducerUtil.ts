import { ApolloQueryResult } from "../actions";
import { FareZone } from "../models/FareZone";
import { MapState } from "./mapReducer";

const mergeFareZones = (prev: FareZone[], next: FareZone[]) => {
  const map = new Map();
  prev.forEach((item) => map.set(item.id, item));
  next
    .map(({ polygon, ...rest }) => ({
      ...rest,
      polygon: {
        ...polygon,
        coordinates: polygon.coordinates.map((lnglat: number[]) =>
          lnglat.slice().reverse()
        ),
      },
    }))
    .forEach((item) => map.set(item.id, { ...map.get(item.id), ...item }));
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
