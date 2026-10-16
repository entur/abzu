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

import PARKING_USER_TYPE from "./parkingUserType";

// The total the editor shows. Tiamat sets the stored total to the sum of
// the entries on save, so the sum of the rows is the total a save produces.
// A save sends no entries for a parking that has no rows and held no stored
// entries, so that parking keeps its stored total.
export const capacityEntriesTotal = (parking) => {
  const capacityEntries = parking?.capacityEntries;
  const storedTotal = parking?.totalCapacity;
  const storedSpaces = parking?.parkingProperties?.[0]?.spaces || [];
  const counts = (capacityEntries || [])
    .map((entry) => entry.numberOfSpaces)
    .filter((count) => count !== null && count !== undefined && count !== "")
    .map(Number)
    .filter((count) => !isNaN(count));

  if (!capacityEntries?.length && !storedSpaces.length) {
    return storedTotal ?? null;
  }

  const total = counts.reduce((sum, count) => sum + count, 0);

  return total > 0 ? total : null;
};

const hasValue = (value) =>
  value !== null && value !== undefined && value !== "";

// The legacy editor shows one count for all users and one for registered
// disabled users. These fields give it that view of the capacity entries.
// When more than one entry holds a user type, the legacy editor cannot tell
// which entry a count belongs to, so it disables that count.
export const legacyCapacityFields = (parking) => {
  const storedSpaces = parking?.parkingProperties?.[0]?.spaces || [];
  const entries = parking?.hasFullFieldSet
    ? parking.capacityEntries || []
    : storedSpaces;
  const ofUserType = (userType) =>
    entries.filter((entry) => entry.parkingUserType === userType);
  const count = (userType, field) => {
    const [entry] = ofUserType(userType);
    return entry?.[field];
  };
  const ambiguity = {
    numberOfSpacesIsAmbiguous:
      ofUserType(PARKING_USER_TYPE.ALL_USERS).length > 1,
    numberOfSpacesForRegisteredDisabledUserTypeIsAmbiguous:
      ofUserType(PARKING_USER_TYPE.REGISTERED_DISABLED).length > 1,
  };

  if (!parking?.hasFullFieldSet) {
    return {
      numberOfSpaces: null,
      numberOfSpacesWithRechargePoint: null,
      numberOfSpacesForRegisteredDisabledUserType: null,
      ...ambiguity,
    };
  }

  const holdsEntries = entries.length > 0 || parking.parkingProperties?.length;

  return {
    numberOfSpaces: holdsEntries
      ? count(PARKING_USER_TYPE.ALL_USERS, "numberOfSpaces")
      : parking.totalCapacity,
    numberOfSpacesWithRechargePoint: count(
      PARKING_USER_TYPE.ALL_USERS,
      "numberOfSpacesWithRechargePoint",
    ),
    numberOfSpacesForRegisteredDisabledUserType: count(
      PARKING_USER_TYPE.REGISTERED_DISABLED,
      "numberOfSpaces",
    ),
    ...ambiguity,
  };
};

export const withLegacyCapacityFields = (parking) =>
  Object.assign(parking, legacyCapacityFields(parking));

// The legacy editor edits the first entry that holds the user type. It adds
// an entry only when that entry would carry a value.
export const setLegacyCapacityCount = (parking, userType, field, value) => {
  parking.capacityEntries = parking.capacityEntries || [];
  const storedSpaces = parking.parkingProperties?.[0]?.spaces || [];

  // The legacy editor shows the stored total as the all-users count of a
  // parking that holds no entries. The first edit keeps that count as an
  // entry, because a save sends only the entries.
  if (
    !parking.capacityEntries.length &&
    !storedSpaces.length &&
    hasValue(parking.totalCapacity)
  ) {
    parking.capacityEntries.push({
      parkingVehicleType: null,
      parkingUserType: PARKING_USER_TYPE.ALL_USERS,
      parkingStayType: null,
      numberOfSpaces: parking.totalCapacity,
      numberOfSpacesWithRechargePoint: null,
    });
  }

  const entry = parking.capacityEntries.find(
    (candidate) => candidate.parkingUserType === userType,
  );

  if (entry) {
    entry[field] = value;
  } else if (hasValue(value)) {
    parking.capacityEntries.push({
      parkingVehicleType: null,
      parkingUserType: userType,
      parkingStayType: null,
      numberOfSpaces: null,
      numberOfSpacesWithRechargePoint: null,
      [field]: value,
    });
  }

  return withLegacyCapacityFields(parking);
};
