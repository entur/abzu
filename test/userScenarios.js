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
import { getAllowanceInfoForStop} from '../reducers/rolesReducerUtils';
import mockRailReplacementStop from './mock/mockRailReplacementStop';
import mockRailStop from './mock/mockRailStop';
import mockBusStop from './mock/mockBusStop';
import mockStopWithoutModality from './mock/mockStopWithoutModality';


describe('User and roles - scenarios', () => {

  it('nsbEditStops - train and railReplacementBus - verify railReplacementBus ', () => {

    let token = {
      roles: [
        JSON.stringify({
          "r": "editStops",
          "o": "OST",
          "z": "01",
          "e": {
            "EntityType": [
              "*"
            ],
            "StopPlaceType": [
              "railStation"
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

  it('nsbEditStops - train and railReplacementBus - verify railStation', () => {

    let token = {
      roles: [
        JSON.stringify({
          "r": "editStops",
          "o": "OST",
          "z": "01",
          "e": {
            "EntityType": [
              "*"
            ],
            "StopPlaceType": [
              "railStation"
            ],
            "Submode": [
              "railReplacementBus",
            ],
          }
        })
      ]
    };

    const allowanceInfo = getAllowanceInfoForStop(mockRailStop, token);
    expect(allowanceInfo.canEdit).toEqual(true);
  });

  it('nsbEditStops - train and railReplacementBus - verify railStation', () => {

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
              "railStation",
            ],
            "Submode": [
              "railReplacementBus",
            ],
          }
        })
      ]
    };

    const allowanceInfo = getAllowanceInfoForStop(mockRailStop, token);
    expect(allowanceInfo.canEdit).toEqual(true);
    const allowanceBusStop = getAllowanceInfoForStop(mockBusStop, token);
    expect(allowanceBusStop.canEdit).toEqual(false);
  });

  it('nsbEditStops - train and railReplacementBus - one role for each - verify railStation', () => {

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
              "railStation"
            ],
          }
        }),
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
    expect(allowanceInfo.canEdit).toEqual(true);
  });

  it('(Vestfold) Edit stops - blacklisted StopPlaceType and Submode', () => {

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
              "!railStation",
            ],
            "Submode": [
              "!railReplacementBus",
            ],
          }
        })
      ]
    };

    const allowanceRailStop = getAllowanceInfoForStop(mockRailStop, token);
    expect(allowanceRailStop.canEdit).toEqual(false);
    const allowanceRailReplacementBus = getAllowanceInfoForStop(mockRailReplacementStop, token);
    expect(allowanceRailReplacementBus.canEdit).toEqual(false);
  });

  it('(Østfold) Edit stops - blacklisted StopPlaceType and Submode', () => {

    let token = {
      roles: [
        JSON.stringify({
          "r": "editStops",
          "o": "OST",
          "z": "01",
          "e": {
            "EntityType": [
              "*"
            ],
            "StopPlaceType": [
              "!railStation",
              "!airport"
            ],
            "Submode": [
              "!railReplacementBus",
            ],
          }
        })
      ]
    };

    const allowanceRailStop = getAllowanceInfoForStop(mockRailStop, token);
    expect(allowanceRailStop.canEdit).toEqual(false);
    const allowanceBusStop = getAllowanceInfoForStop(mockBusStop, token);
    expect(allowanceBusStop.canEdit).toEqual(true);
  });

  it('(Troms) Edit stops', () => {

    let token = {
      roles: [
        JSON.stringify({
          "r": "editStops",
          "o": "OST",
          "z": "01",
          "e": {
            "EntityType": [
              "*"
            ],
            "StopPlaceType": [
              "!railStation",
              "!airport"
            ],
            "Submode": [
              "!railReplacementBus",
            ],
          }
        })
      ]
    };

    const allowanceRailStop = getAllowanceInfoForStop(mockRailStop, token);
    expect(allowanceRailStop.canEdit).toEqual(false);
    const allowanceBusStop = getAllowanceInfoForStop(mockBusStop, token);
    expect(allowanceBusStop.canEdit).toEqual(true);
  });

  it('Administer all stops, StopPlaceType = *', () => {

    let token = {
      roles: [
        JSON.stringify({
          "r": "editStops",
          "o": "OST",
          "z": "01",
          "e": {
            "EntityType": [
              "*"
            ],
            "StopPlaceType": [
              "*",
            ],
          }
        })
      ]
    };

    const allowanceRailStop = getAllowanceInfoForStop(mockRailStop, token);
    expect(allowanceRailStop.canEdit).toEqual(true);
    const allowanceBusStop = getAllowanceInfoForStop(mockBusStop, token);
    expect(allowanceBusStop.canEdit).toEqual(true);
    const allowanceRailReplacementBus = getAllowanceInfoForStop(mockRailReplacementStop, token);
    expect(allowanceRailReplacementBus.canEdit).toEqual(true);
  });

  it('Administer all stops, StopPlaceType not defined', () => {

    const token = {
      roles: [
        JSON.stringify({
          "r": "editStops",
          "o": "OST",
          "z": "01",
          "e": {
            "EntityType": [
              "*"
            ],
          }
        })
      ]
    };

    const allowanceRailStop = getAllowanceInfoForStop(mockRailStop, token);
    expect(allowanceRailStop.canEdit).toEqual(true);
    const allowanceBusStop = getAllowanceInfoForStop(mockBusStop, token);
    expect(allowanceBusStop.canEdit).toEqual(true);
    const allowanceRailReplacementBus = getAllowanceInfoForStop(mockRailReplacementStop, token);
    expect(allowanceRailReplacementBus.canEdit).toEqual(true);
  });


  it('should be able to edit stop place with no modality if other requirements are meet', () => {

    const token = {
      roles: [
        JSON.stringify({
          "r": "editStops",
          "o": "ATB",
          "z": "KVE:TopographicPlace:16",
          "e": {
            "EntityType": [
              "*"
            ],
            "StopPlaceType": ["!railStation","!airport"],
            "Submode": ["!railReplacementBus"]
          }
        })
      ]
    };

    const allowanceStopWithNoModality = getAllowanceInfoForStop(mockStopWithoutModality, token);
    expect(allowanceStopWithNoModality.canEdit).toEqual(true);

  })

});
