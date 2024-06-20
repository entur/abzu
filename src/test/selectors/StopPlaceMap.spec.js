import { getMarkersForMap } from '../../selectors/StopPlaceMap';

describe('getMarkersForMap', () => {
  test('should return an empty array when no markers are present', () => {
    const result = getMarkersForMap({ stopPlace: {}, user: {} });
    expect(result).toEqual([]);
  });

  test('should return activeSearchResult with children', () => {
    const stopPlace = {
      activeSearchResult: { id: 1, isParent: true, children: [{ id: 2 }] },
    };
    const result = getMarkersForMap({ stopPlace, user: {} });
    expect(result).toEqual([{ id: 1, isParent: true, children: [{ id: 2 }] }, { id: 2 }]);
  });

  test('should return newStop when isCreatingNewStop is true', () => {
    const stopPlace = { newStop: { id: 3 } };
    const user = { isCreatingNewStop: true };
    const result = getMarkersForMap({ stopPlace, user });
    expect(result).toEqual([{ id: 3 }]);
  });

  test('should return neighbourStops', () => {
    const stopPlace = { neighbourStops: [{ id: 4 }, { id: 5 }] };
    const result = getMarkersForMap({ stopPlace, user: {} });
    expect(result).toEqual([{ id: 4 }, { id: 5 }]);
  });

  test('should return findCoordinates', () => {
    const stopPlace = { findCoordinates: { id: 6 } };
    const result = getMarkersForMap({ stopPlace, user: {} });
    expect(result).toEqual([{ id: 6 }]);
  });
});