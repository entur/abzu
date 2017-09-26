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
import StopsWithDuplicateImportedIds from './mock/StopsWithSharedDupId';
import { findDuplicateImportedIds } from '../utils/';

describe('duplicateIds', () => {
  it('should find all duplicate Ids on quays within stopPlace', () => {
    const duplicationInfo = findDuplicateImportedIds([
      StopWithDuplicateImportedIds
    ]);
    const {
      quaysWithDuplicateImportedIds,
      stopPlacesWithConflict,
      fullConflictMap
    } = duplicationInfo;
    expect(quaysWithDuplicateImportedIds).toEqual({
      'BRA:Quay:0220050101': ['NSR:Quay:5735', 'NSR:Quay:5736']
    });
    expect(stopPlacesWithConflict).toEqual(['NSR:StopPlace:3247']);
    expect(fullConflictMap).toEqual({
      'BRA:Quay:0220050101': {
        'NSR:StopPlace:3247': ['NSR:Quay:5735', 'NSR:Quay:5736']
      }
    });
  });

  it('should find all duplicate Ids on quays between stopPlaces', () => {
    const duplicationInfo = findDuplicateImportedIds(
      StopsWithDuplicateImportedIds
    );
    const {
      stopPlacesWithConflict,
      fullConflictMap,
      quaysWithDuplicateImportedIds
    } = duplicationInfo;

    expect(stopPlacesWithConflict).toEqual([
      'NSR:StopPlace:10000',
      'NSR:StopPlace:10002'
    ]);
    expect(quaysWithDuplicateImportedIds).toEqual({
      'HED:Quay:0412162401': [
        'NSR:Quay:17061',
        'NSR:Quay:17062',
        'NSR:Quay:17064'
      ],
      'HED:Quay:412162401': ['NSR:Quay:17061', 'NSR:Quay:17064'],
      'OPP:Quay:412162401': ['NSR:Quay:17061', 'NSR:Quay:17064']
    });

    expect(fullConflictMap).toEqual({
      'HED:Quay:0412162401': {
        'NSR:StopPlace:10000': ['NSR:Quay:17061', 'NSR:Quay:17062'],
        'NSR:StopPlace:10002': ['NSR:Quay:17064']
      },
      'HED:Quay:412162401': {
        'NSR:StopPlace:10000': ['NSR:Quay:17061'],
        'NSR:StopPlace:10002': ['NSR:Quay:17064']
      },
      'OPP:Quay:412162401': {
        'NSR:StopPlace:10000': ['NSR:Quay:17061'],
        'NSR:StopPlace:10002': ['NSR:Quay:17064']
      }
    });
  });
});
