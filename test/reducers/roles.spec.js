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


import { isModeOptionsValidForMode, getRoleOptions } from '../../roles/rolesParser';
import { getAllowanceInfoForStop , getLatLngFromResult, getLegalStopPlaceTypes, getLegalSubmodes } from '../../reducers/rolesReducerUtils';
import stopTypes, { submodes } from '../../models/stopTypes';
import mockRailReplacementStop from '../mock/mockRailReplacementStop';
import mockBusStop from '../mock/mockBusStop';
import stopWithoutStopPlaceType from '../mock/stopWithoutStopPlaceType';
import mockRailStop from '../mock/mockRailStop';

const stopPlaceResult = {
  data: {
    stopPlace: [
      {
        geometry: {
          coordinates: [
            [
              10.434486,
              59.833343
            ]
          ]
        }
      }
    ]
  }
};

describe('getAllowanceInfo', () => {


  test('should get latlng from stopPlaceResult', () => {
    let latlng = getLatLngFromResult(stopPlaceResult);
    expect(latlng).toEqual([59.833343, 10.434486]);
  })

  test('should get legal submode types when *', () => {

    let roles = [
      {
        "r": "editStops",
        "o": "OST",
        "z": "01",
        "e": {
          "EntityType": [
            "StopPlace"
          ],
          "Submode": [
            "*",
          ],
        }
      }
    ];

    let legalSubmodes = getLegalSubmodes(roles);
    expect(legalSubmodes).toEqual(submodes);
  })

  test('should get legal submode types when whitelisted', () => {

    let roles = [
      {
        "r": "editStops",
        "o": "OST",
        "z": "01",
        "e": {
          "EntityType": [
            "StopPlace"
          ],
          "Submode": [
            "railReplacementBus",
          ],
        }
      }
    ];

    let legalSubmodes = getLegalSubmodes(roles);
    expect(legalSubmodes).toEqual([
      "railReplacementBus"
    ]);
  });

  test('should be able to edit railReplacementBus stop', () => {

    let token = {
      roles: [
        JSON.stringify({
          "r": "editStops",
          "o": "OST",
          "z": "01",
          "e": {
            "EntityType": [
              "StopPlace"
            ],
            "Submode": [
              "railReplacementBus",
            ],
          }
        })
        ]
    };

    const allowanceInfo = getAllowanceInfoForStop(mockRailReplacementStop, token);
    expect(allowanceInfo.canEdit).toEqual(true);
  });


  test(
    'should be able to edit railReplacementBus stop with only submode in role',
    () => {

      let token = {
        roles: [
          JSON.stringify({
            "r": "editStops",
            "o": "OST",
            "z": "01",
            "e": {
              "EntityType": [
                "StopPlace"
              ],
              "Submode": [
                "railReplacementBus",
              ],
            }
          })
        ]
      };

      const allowanceInfo = getAllowanceInfoForStop(mockRailReplacementStop, token);
      expect(allowanceInfo.canEdit).toEqual(true);
    }
  );


  test(
    'should be able to edit railReplacementBus even if is stopPLaceType is not set in role',
    () => {

      let token = {
        roles: [
          JSON.stringify({
            "r": "editStops",
            "o": "OST",
            "z": "01",
            "e": {
              "EntityType": [
                "StopPlace"
              ],
              "Submode": [
                "railReplacementBus",
              ],
            }
          })
        ]
      };

      const allowanceInfo = getAllowanceInfoForStop(mockRailReplacementStop, token);
      expect(allowanceInfo.canEdit).toEqual(true);
    }
  );


  test(
    'should not be able to edit trainStop if submode stopPlaceType is not set and submode is railReplacementBus',
    () => {

      let token = {
        roles: [
          JSON.stringify({
            "r": "editStops",
            "o": "OST",
            "z": "01",
            "e": {
              "EntityType": [
                "StopPlace"
              ],
              "Submode": [
                "railReplacementBus",
              ],
            }
          })
        ]
      };

      const allowanceInfo = getAllowanceInfoForStop(mockRailStop, token);
      expect(allowanceInfo.canEdit).toEqual(false);

    }
  )

  test(
    'should not be able to edit stop without submode railReplacementBus if is relevant for stopPlace',
    () => {

      let token = {
        roles: [
          JSON.stringify({
            "r": "editStops",
            "o": "OST",
            "z": "01",
            "e": {
              "EntityType": [
                "StopPlace"
              ],
              "Submode": [
                "railReplacementBus",
              ],
            }
          })
        ]
      };

      const allowanceInfo = getAllowanceInfoForStop(mockBusStop, token);
      expect(allowanceInfo.canEdit).toEqual(false);
    }
  );

  test(
    'should be able to edit stop if stopPlace type is not set and StopPlaceType is *',
    () => {

      let token = {
        roles: [
          JSON.stringify({
            "r": "editStops",
            "o": "OST",
            "z": "01",
            "e": {
              "EntityType": [
                "StopPlace"
              ],
              "StopPlaceType": [
                "*",
              ],
            }
          })
        ]
      };

      const allowanceInfo = getAllowanceInfoForStop(stopWithoutStopPlaceType, token);
      expect(allowanceInfo.canEdit).toEqual(true);
    }
  );

  test(
    'should be able to edit stop if stopPlace type is not set and StopPlaceType is not defined',
    () => {

      let token = {
        roles: [
          JSON.stringify({
            "r": "editStops",
            "o": "OST",
            "z": "01",
            "e": {
              "EntityType": [
                "StopPlace"
              ],
            }
          })
        ]
      };

      const allowanceInfo = getAllowanceInfoForStop(stopWithoutStopPlaceType, token);
      expect(allowanceInfo.canEdit).toEqual(true);
    }
  );

  test('should get legal stopPlace types when blacklisted', () => {

    let roles = [
      {
        "r": "editStops",
        "o": "OST",
        "z": "01",
        "e": {
          "EntityType": [
            "StopPlace"
          ],
          "StopPlaceType": [
            "!airport",
            "!railStation"
          ],
        }
      }
    ];

    let legalStopPlaceTypes = getLegalStopPlaceTypes(roles);
    expect(legalStopPlaceTypes).toEqual(
      [
        "onstreetBus",
        "busStation",
        "harbourPort",
        "ferryStop",
        "onstreetTram",
        "metroStation",
        "liftStation"
      ]
    );
  });


  test('should get legal stopPlace types that are whitelisted', () => {

    let roles = [
      {
        "r": "editStops",
        "o": "OST",
        "z": "01",
        "e": {
          "EntityType": [
            "StopPlace"
          ],
          "StopPlaceType": [
            "airport",
            "railStation"
          ],
        }
      }
    ];

    let legalStopPlaceTypes = getLegalStopPlaceTypes(roles);
    expect(legalStopPlaceTypes).toEqual(
      [
        "railStation",
        "airport"
      ]
    );
  });


  test('should get all stopPlace types when * is used', () => {

    let roles = [
      {
        "r": "editStops",
        "o": "OST",
        "z": "01",
        "e": {
          "EntityType": [
            "StopPlace"
          ],
          "StopPlaceType": [
            "*"
          ],
        }
      }
    ];

    let legalStopPlaceTypes = getLegalStopPlaceTypes(roles);
    let allStopTypes = stopTypes.en.map( type => type.value);

    expect(legalStopPlaceTypes).toEqual(allStopTypes);
  });


  test('should determine whether submode is valid based on options', () => {
    const listedSubmodes = [
      "!railReplacementBus"
    ];

    let allSubmodes = [];

    stopTypes.en.map( stopType => {
      if (stopType.submodes) {
        stopType.submodes.forEach( submode => {
          if(submode.value)
            allSubmodes.push(submode.value)
        });
      }
    });

    const options1 = getRoleOptions(listedSubmodes, allSubmodes);
    let valid1 = isModeOptionsValidForMode(options1, 'sightseeingService');

    expect(valid1).toEqual(true);
  })

  test('should determine whether stopType is valid based on options', () => {

    const listedStopPlaceTypes1 = [
      "!railStation",
    ];

    const listedStopPlaceTypes2 = ['*'];

    const listedStopPlaceTypes3 = ['airport', 'ferryStop'];
    const allStopTypes = stopTypes.en.map( stopType => stopType.value);

    const options1 = getRoleOptions(listedStopPlaceTypes1, allStopTypes);
    const options2 = getRoleOptions(listedStopPlaceTypes2, allStopTypes);
    const options3 = getRoleOptions(listedStopPlaceTypes3, allStopTypes);

    let valid1 = isModeOptionsValidForMode(options1, 'airport');
    let valid2 = isModeOptionsValidForMode(options2, 'airport');
    let valid3 = isModeOptionsValidForMode(options3, 'airport');
    let invalid1 = isModeOptionsValidForMode(options3, 'metroStation');
    let invalid2 = isModeOptionsValidForMode(options1, 'railStation');

    expect(valid1).toEqual(true);
    expect(valid2).toEqual(true);
    expect(valid3).toEqual(true);

    expect(invalid1).toEqual(false);
    expect(invalid2).toEqual(false);
  });


});
