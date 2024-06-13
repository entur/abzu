import { selectKeyValuesDataSource } from '../../reducers/selectors';

describe('selectKeyValuesDataSource', () => {
  test('should return an empty array when keyValuesOrigin is undefined', () => {
    const result = selectKeyValuesDataSource(undefined, {});
    expect(result).toEqual([]);
  });

  test('should return an empty array when keyValuesOrigin does not have type', () => {
    const result = selectKeyValuesDataSource({}, {});
    expect(result).toEqual([]);
  });

  test('should return stopPlace keyValues when keyValuesOrigin.type is "stopPlace"', () => {
    const keyValuesOrigin = { type: 'stopPlace' };
    const stopPlace = { keyValues: ['a', 'b', 'c'] };
    const result = selectKeyValuesDataSource(keyValuesOrigin, stopPlace);
    expect(result).toEqual(['a', 'b', 'c']);
  });

  test('should return quay keyValues when keyValuesOrigin.type is "quay"', () => {
    const keyValuesOrigin = { type: 'quay', index: 0 };
    const stopPlace = { quays: [{ keyValues: ['a', 'b'] }, { keyValues: ['c', 'd'] }, { keyValues: ['e', 'f'] }] };
    const result = selectKeyValuesDataSource(keyValuesOrigin, stopPlace);
    expect(result).toEqual(['a', 'b']);
  });

  test('should return an empty array when keyValuesOrigin.type is "quay" and index is out of bounds', () => {
    const keyValuesOrigin = { type: 'quay', index: 100 };
    const stopPlace = { quays: [{ keyValues: ['a', 'b'] }, { keyValues: ['c', 'd'] }, { keyValues: ['e', 'f'] }] };
    const result = selectKeyValuesDataSource(keyValuesOrigin, stopPlace);
    expect(result).toEqual([]);
  });

  test('should return an empty array when keyValuesOrigin.type is "OTHER"', () => {
    const keyValuesOrigin = { type: 'OTHER', index: 0 };
    const stopPlace = { quays: [{ keyValues: ['a', 'b'] }, { keyValues: ['c', 'd'] }, { keyValues: ['e', 'f'] }] };
    const result = selectKeyValuesDataSource(keyValuesOrigin, stopPlace);
    expect(result).toEqual([]);
  });

  test('should return an empty array when keyValuesOrigin.type is unsupported', () => {
    const keyValuesOrigin = { type: null };
    const stopPlace = { keyValues: ['key1', 'key2'] };
    const result = selectKeyValuesDataSource(keyValuesOrigin, stopPlace);
    expect(result).toEqual([]);
  });
});
