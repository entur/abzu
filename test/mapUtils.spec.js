import { getCentroid } from '../utils/mapUtils';

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

});
