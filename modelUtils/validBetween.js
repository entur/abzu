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

// determines whether an entity has expired based on validBetweens
export const hasExpired = validBetween => {

  if (!validBetween) return false;

  if (validBetween.toDate === null) return false;

  let toDate = new Date(validBetween.toDate);
  let nowDate = new Date();

  return toDate <= nowDate;
};

export const isFuture = validBetween => {

  if (!validBetween) {
    return false;
  };

  if (validBetween.fromDate === null) return false;

  let fromDate = new Date(validBetween.fromDate);
  let nowDate = new Date();

  return fromDate >= nowDate;
};
