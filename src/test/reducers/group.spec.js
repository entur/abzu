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


import { groupOfStopPlaceReducer } from './../../reducers/';
import groupOfStopPlaceQuery from './json/groupOfStopPlace.json';
import groupOfStopPlaceMutation from './json/groupOfStopPlaceMutation.json';
import mapHelper from '../../modelUtils/mapToQueryVariables';

describe('Model: map Group of Stop Place from server to expected client model', () => {

  test('should map GraphQL query result to client model for Group of StopPlace', () => {

    const action = {
      type: 'APOLLO_QUERY_RESULT',
      result: groupOfStopPlaceQuery,
      operationName: 'getGroupOfStopPlaces'
    };

    const state = groupOfStopPlaceReducer({}, action);
    expect(state).toMatchSnapshot();
  });

  test('should map GraphQL mutation result to client model for Group of StopPlace', () => {

    const action = {
      type: 'APOLLO_MUTATION_RESULT',
      result: groupOfStopPlaceMutation,
      operationName: 'mutateGroupOfStopPlaces'
    };

    const state = groupOfStopPlaceReducer({}, action);
    expect(state).toMatchSnapshot();
  });

  test('should map client model for Group of StopPlace to schema', () => {

    const action = {
      type: 'APOLLO_QUERY_RESULT',
      result: groupOfStopPlaceQuery,
      operationName: 'getGroupOfStopPlaces'
    };
    const state = groupOfStopPlaceReducer({}, action);
    const clientGroupOfStopPlace = state.current;
    const groupOfStopPlaceExample = mapHelper.mapGroupOfStopPlaceToVariables(clientGroupOfStopPlace);
    expect(groupOfStopPlaceExample).toMatchSnapshot();

  });

});
