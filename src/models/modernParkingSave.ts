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

import mapToMutationVariables from "../modelUtils/mapToQueryVariables";
import PARKING_TYPE from "./parkingType";

interface CapacityRow {
  parkingVehicleType?: string | null;
  isNew?: boolean;
  numberOfSpaces?: number | string | null;
  numberOfSpacesWithRechargePoint?: number | string | null;
}

interface StoredParkingProperties {
  spaces?: { parkingVehicleType?: string | null }[];
}

export interface ClientParking {
  parkingVehicleTypes?: string[];
  capacityEntries?: CapacityRow[];
  parkingProperties?: StoredParkingProperties[];
  hasFullFieldSet?: boolean;
  parkingType?: string;
  [key: string]: unknown;
}

const withoutEmptyTypes = (types: (string | null | undefined)[]): string[] =>
  types.filter((type): type is string => Boolean(type));

const vehicleTypesOfStoredGroups = (
  groups: StoredParkingProperties[],
): string[] =>
  withoutEmptyTypes(
    groups.flatMap((group) =>
      (group.spaces ?? []).map((space) => space.parkingVehicleType),
    ),
  );

/**
 * Returns the vehicle type list that a modern save sends for one parking.
 * The save adds each type of a saved capacity row and removes a type only when
 * the editor removed or retyped its last row. Every other type stays, and the
 * list is never empty after the save.
 */
export const vehicleTypesAfterSave = (parking: ClientParking): string[] => {
  const currentTypes = parking.parkingVehicleTypes ?? [];

  if (!parking.hasFullFieldSet) {
    return currentTypes;
  }

  const storedGroups = parking.parkingProperties ?? [];
  const [, ...keptGroups] = storedGroups;
  const loadedTypes = new Set(vehicleTypesOfStoredGroups(storedGroups));
  const savedRows = mapToMutationVariables.keptCapacityEntries(
    parking.capacityEntries ?? [],
  ) as CapacityRow[];
  // The editor shows and edits only the first group. The save keeps the other
  // groups unchanged, so a type that one of them holds stays saved.
  const savedTypes = new Set([
    ...withoutEmptyTypes(savedRows.map((row) => row.parkingVehicleType)),
    ...vehicleTypesOfStoredGroups(keptGroups),
  ]);

  const keptTypes = currentTypes.filter(
    (type) => !loadedTypes.has(type) || savedTypes.has(type),
  );
  const addedTypes = [...savedTypes].filter(
    (type) => !keptTypes.includes(type),
  );
  const nextTypes = [...keptTypes, ...addedTypes];

  return nextTypes.length > 0 ? nextTypes : currentTypes;
};

/**
 * Maps the parkings of a modern save to mutation variables. It updates the
 * vehicle type list from the capacity rows and stores the park-and-ride type,
 * so that the next load does not guess a different type. The legacy save does
 * not call this function.
 */
export const toModernParkingVariables = (
  parkings: ClientParking[],
  parentRef: string,
): Record<string, unknown>[] => {
  const parkingsWithNewTypes = parkings.map((parking) => ({
    ...parking,
    parkingVehicleTypes: vehicleTypesAfterSave(parking),
  }));
  const variables = mapToMutationVariables.mapParkingToVariables(
    parkingsWithNewTypes,
    parentRef,
  ) as Record<string, unknown>[];

  return variables.map((mapped, index) => {
    const source = parkings[index];

    if (
      source.hasFullFieldSet &&
      source.parkingType === PARKING_TYPE.PARK_AND_RIDE
    ) {
      return { ...mapped, parkingType: PARKING_TYPE.PARK_AND_RIDE };
    }

    return mapped;
  });
};
