import expect from 'expect';
import { isModeOptionsValidForMode, getModeOptions } from '../../roles/rolesParser';
import { getAllowanceInfo , getLatLngFromResult, getLegalStopPlaceTypes} from '../../reducers/rolesReducerUtils';
import stopTypes from '../../models/stopTypes';

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

  it('should get legal stopPlaces when blacklisted', () => {

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
        "onstreetTram",
        "metroStation",
        "busStation",
        "harbourPort",
        "ferryStop",
        "liftStation"
      ]
    );
  });

  it('should get legal stopPlaces that are whitelisted', () => {

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
        "airport",
        "railStation"
      ]
    );
  });

  it('should get all stopPlaces when * is used', () => {

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

    const options1 = getModeOptions(listedStopPlaceTypes1);
    const options2 = getModeOptions(listedStopPlaceTypes2);
    const options3 = getModeOptions(listedStopPlaceTypes3);
    const options4 = getModeOptions(listedStopPlaceTypes4);

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
  })

  it('should determine whether stopType is valid based on options', () => {

    const listedStopPlaceTypes1 = [
      "!railStation",
    ];

    const listedStopPlaceTypes2 = ['*'];

    const listedStopPlaceTypes3 = ['airport', 'ferryStop'];

    const options1 = getModeOptions(listedStopPlaceTypes1);
    const options2 = getModeOptions(listedStopPlaceTypes2);
    const options3 = getModeOptions(listedStopPlaceTypes3);

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
  })

});
