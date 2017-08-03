import { extractCoordinates } from '../utils/'
import expect from 'expect';

describe('extractors', () => {

  it('should extract latlng from user provided string', () => {

    const latLngStringComma = "59.927582, 10.698881";
    const latLngFromComma = extractCoordinates(latLngStringComma);
    const latLngExpected = [59.927582, 10.698881];

    expect(latLngFromComma).toEqual(latLngExpected);

    const latLngStringSpace = "59.927582 10.698881";
    const latLngFromSpace = extractCoordinates(latLngStringSpace);

    expect(latLngFromSpace).toEqual(latLngExpected);

    const latLngStringTab = "59.927582  10.698881";

    const latLngFromTab = extractCoordinates(latLngStringTab);

    expect(latLngFromTab).toEqual(latLngExpected);
  });

});

