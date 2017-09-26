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


import expect from 'expect';
import StopWithDuplicateImportedIds from './mock/StopWithDuplicateImportedIds';
import { findDuplicateImportedIds } from '../utils/'

describe('duplicateIds', () => {

  it('should find all duplicate Ids from list of stopPlaces', () => {
      const duplicationInfo = findDuplicateImportedIds([StopWithDuplicateImportedIds]);
      const {quaysWithDuplicateImportedIds, stopPlacesWithConflict, fullConflictMap} = duplicationInfo;
      expect(quaysWithDuplicateImportedIds).toEqual({
        'BRA:Quay:0220050101': [ 'NSR:Quay:5735', 'NSR:Quay:5736' ]
      });
      expect(stopPlacesWithConflict).toEqual([ 'NSR:StopPlace:3247' ]);
      expect(fullConflictMap).toEqual({ 'BRA:Quay:0220050101': { 'NSR:StopPlace:3247': [ 'NSR:Quay:5735', 'NSR:Quay:5736' ] } });
  });

});
