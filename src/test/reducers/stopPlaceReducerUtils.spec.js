import { getProperZoomLevel } from '../../reducers/stopPlaceReducerUtils';

describe('getProperZoomLevel', () => {
    test('should return 5 when data or data.location is falsy', () => {
      const data = null;
      const prevZoom = 10;
      const result = getProperZoomLevel(data, prevZoom);
      expect(result).toEqual(5);
    });
  
    test('should return prevZoom when prevZoom > 15', () => {
      const data = { location: false };
      const prevZoom = 20;
      const result = getProperZoomLevel(data, prevZoom);
      expect(result).toEqual(prevZoom);
    });
  
    test('should return 15 when prevZoom <= 15 ', () => {
      const data = { location: false };
      const prevZoom = 10;
      const result = getProperZoomLevel(data, prevZoom);
      expect(result).toEqual(15);
    });
});