import { getCentroid, isCoordinatesInsidePolygon } from '../utils/mapUtils';
import polygonVestfold from './mock/polygon-vestfold';

import expect from 'expect';

describe('mapUtils', () => {

  it('should return centroid of a list of latlngs', () => {

    const latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
    const expectedCentroid = [ 39, -105.545 ];
    const centroid = getCentroid(latlngs, null);

    expect(centroid).toEqual(expectedCentroid);

  });

  it('should handle getCentroid of an empty list of latlngs by returning original centroid', () => {

    const emptyListOfLatLngs = [];
    const originalCentroid = [39.2, -10.20];
    const centroid = getCentroid(emptyListOfLatLngs, originalCentroid);

    expect(centroid).toEqual(originalCentroid);
  });

  it('is latLng inside polygon', () => {

     let latLngSandefjord = [59.135352, 10.222701];
     let latLngOsloS = [59.909512,10.753839];
     let latLngVerketNearVestfold = [59.613143,10.4132]

     let isSandefjordInside = isCoordinatesInsidePolygon(latLngSandefjord, polygonVestfold);
     let isOsloSInside = isCoordinatesInsidePolygon(latLngOsloS, polygonVestfold);
     let isVerketNearVestFoldInside = isCoordinatesInsidePolygon(latLngVerketNearVestfold, polygonVestfold);

     expect(isSandefjordInside).toEqual(true);
     expect(isVerketNearVestFoldInside).toEqual(false);
     expect(isOsloSInside).toEqual(false);

  })

});

