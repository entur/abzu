import expect from 'expect';
import { isModeOptionsValidForMode, getRoleOptions } from '../../roles/rolesParser';
import { getAllowanceInfoForStop , getLatLngFromResult, getLegalStopPlaceTypes, getLegalSubmodes } from '../../reducers/rolesReducerUtils';
import stopTypes, { submodes } from '../../models/stopTypes';
import mockRailReplacementStop from '../mock/mockRailReplacementStop';
import mockBusStop from '../mock/mockBusStop';
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


  it('should get latlng from stopPlaceResult', () => {
    let latlng = getLatLngFromResult(stopPlaceResult);
    expect(latlng).toEqual([59.833343, 10.434486]);
  })

  it('should get legal submode types when *', () => {

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

  it('should get legal submode types when whitelisted', () => {

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

  it('should be able to edit railReplacementBus stop', () => {

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


  it('should be able to edit railReplacementBus stop with only submode in role', () => {

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


  it('should be able to edit railReplacementBus even if is stopPLaceType is not set in role', () => {

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


  it('should not be able to edit trainStop if submode stopPlaceType is not set and submode is railReplacementBus', () => {

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

  })

  it('should not be able to edit stop without submode railReplacementBus if is relevant for stopPlace', () => {

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
  });

  it('should get legal stopPlace types when blacklisted', () => {

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


  it('should get legal stopPlace types that are whitelisted', () => {

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


  it('should get all stopPlace types when * is used', () => {

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


  it('should determine whether submode is valid based on options', () => {
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

  it('should determine whether stopType is valid based on options', () => {

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
