/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */


import * as types from '../actions/Types';
import formatHelpers from '../modelUtils/mapToClient';
import { findDuplicateImportedIds } from '../utils/';

export const initialState = {
  topographicalPlaces: [],
  results: [],
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.APOLLO_QUERY_RESULT:
      if (action.operationName === 'TopopGraphicalPlacesForReport') {
        return reduceTopopGraphicalPlacesForReport(state, action);
      } else if (action.operationName === 'findStopForReport') {
        return reduceSearchResultsForReport(state, action);
        // Used for adding parking elements to stopPlaces
      } else if (!action.operationName) {
        return populateStopPlacesWithParking(state, action.result.data);
      } else {
        return state;
      }

    default:
      return state;
  }
};

const reduceTopopGraphicalPlacesForReport = (state, action) => {
  return Object.assign({}, state, {
    topographicalPlaces: action.result.data.topographicPlace,
  });
};

const reduceSearchResultsForReport = (state, action) => {
  const stops = formatHelpers.mapReportSearchResultsToClientStop(
    action.result.data.stopPlace,
  );
  return Object.assign({}, state, {
    results: stops,
    duplicateInfo: findDuplicateImportedIds(stops)
  });
};

const populateStopPlacesWithParking = (state, results) => {
  const stopPlaces = state.results;
  let stopPlacesWithParking = stopPlaces.map(stopPlace => {
    let aliasedId = stopPlace.id.replace('NSR:StopPlace:', 'StopPlace');
    return Object.assign({}, stopPlace, {
      parking: results[aliasedId],
    });
  });

  return Object.assign({}, state, {
    results: stopPlacesWithParking,
  });
};

export default reportReducer;
