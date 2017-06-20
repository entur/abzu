export const selectKeyValuesDataSource = (keyValuesOrigin, stopPlace) => {
  if (!keyValuesOrigin || !keyValuesOrigin.type) return [];

  let keyValues = [];

  if (keyValuesOrigin.type === 'stopPlace') {
    keyValues = stopPlace.keyValues;
  } else if (keyValuesOrigin.type === 'quay') {
    let quay = stopPlace.quays[keyValuesOrigin.index];
    if (quay) {
      keyValues = stopPlace.quays[keyValuesOrigin.index].keyValues;
    }
  }
  return keyValues;
};
