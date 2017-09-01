export const extractAlternativeNames = alternativeNames => {
  if (!alternativeNames) return [];
  return alternativeNames.filter(
    alt => alt.name && alt.name.value && alt.nameType,
  );
};

export const getImportedId = keyValues => {
  for (let i = 0; i < keyValues.length; i++) {
    if (keyValues[i].key === "imported-id") {
      return keyValues[i].values;
    }
  }
  return [];
};

export const getUniqueStopPlaceTypes = children => {
  let stopPlaceTypes = children.map(child =>
    JSON.stringify({
      stopPlaceType: child.stopPlaceType,
      submode: child.submode
    })
  );

  return [...new Set(stopPlaceTypes)].map(child => JSON.parse(child));
};