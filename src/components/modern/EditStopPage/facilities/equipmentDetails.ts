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

/** Equipment that is ticked first and described afterwards (F-25). */
export type DescribedEquipmentKey = "shelterEquipment" | "waitingRoomEquipment";

export type EquipmentDetailField = "seats" | "stepFree" | "enclosed" | "heated";

/** Yes, no, or not set (null): nothing is assumed until the user says so. */
export type DetailAnswer = boolean | null;

export type EquipmentDetails = Partial<
  Record<EquipmentDetailField, number | boolean | null>
>;

interface WithPlaceEquipments {
  placeEquipments?: Partial<
    Record<DescribedEquipmentKey, EquipmentDetails | null>
  > | null;
}

/** The classic StopPlace / Quay models don't declare placeEquipments. */
export const readEquipment = (
  entity: object,
  equipmentKey: DescribedEquipmentKey,
): EquipmentDetails | null =>
  (entity as WithPlaceEquipments).placeEquipments?.[equipmentKey] ?? null;

/** Seats are a count in the data: more than 0 is yes, 0 is no. */
export const readAnswer = (
  equipment: EquipmentDetails | null,
  field: EquipmentDetailField,
): DetailAnswer => {
  const value = equipment?.[field];
  if (value === null || value === undefined) return null;
  return typeof value === "number" ? value > 0 : value;
};

/**
 * The equipment with one answer changed. A yes for seats keeps an existing
 * count, or sets 1 as the classic UI does; not set is stored as null.
 */
export const withAnswer = (
  equipment: EquipmentDetails | null,
  field: EquipmentDetailField,
  answer: DetailAnswer,
): EquipmentDetails => {
  if (field !== "seats" || answer === null) {
    return { ...equipment, [field]: answer };
  }
  const currentSeats = Number(equipment?.seats) || 0;
  return { ...equipment, seats: answer ? Math.max(currentSeats, 1) : 0 };
};
