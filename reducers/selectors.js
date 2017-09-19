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
