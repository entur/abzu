import expect from 'expect';
import { isModeOptionsValidForMode, getRoleOptions } from '../../roles/rolesParser';
import { getAllowanceInfoForStop , getLatLngFromResult, getLegalStopPlaceTypes, getLegalSubmodes } from '../../reducers/rolesReducerUtils';
import stopTypes, { submodes } from '../../models/stopTypes';
import mockRailReplacementStop from '../mock/mockRailReplacementStop';
import mockBusStop from '../mock/mockBusStop';
import { getSubModeRelevance } from '../../roles/rolesParser';

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


  it('should white- or blacklist based on StopPlaceTypes from role assignment', () => {

    const listedStopPlaceTypes1 = [
      "airport", "railStation"
    ];

    const listedStopPlaceTypes2 = [
      "!airport", "!railStation"
    ];

    const listedStopPlaceTypes3 = [
      "*"
    ];

    const listedStopPlaceTypes4 = [
      "airport", "!railStation"
    ];

    const options1 = getRoleOptions(listedStopPlaceTypes1);
    const options2 = getRoleOptions(listedStopPlaceTypes2);
    const options3 = getRoleOptions(listedStopPlaceTypes3);
    const options4 = getRoleOptions(listedStopPlaceTypes4);

    const expectedOptions1 = {
      blacklisted: [],
      whitelisted: ["airport", "railStation"],
      allowAll: false
    };

    const expectedOptions2 = {
      whitelisted: [],
      blacklisted: ["airport", "railStation"],
      allowAll: false
    };

    const expectedOptions3 = {
      whitelisted: [],
      blacklisted: [],
      allowAll: true
    };

    const expectedOptions4 = {
      whitelisted: ['airport'],
      blacklisted: ['railStation'],
      allowAll: false
    };

    expect(options1).toEqual(expectedOptions1);
    expect(options2).toEqual(expectedOptions2);
    expect(options3).toEqual(expectedOptions3);
    expect(options4).toEqual(expectedOptions4);
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
