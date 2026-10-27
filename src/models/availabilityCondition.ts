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

export const MIDNIGHT = "00:00";
export const END_OF_DAY_INPUT = "24:00";
const TIME_LENGTH = "HH:mm".length;
const SAME_DAY_OFFSET = 0;
const NEXT_DAY_OFFSET = 1;

/** A condition as Tiamat returns it. */
export interface StoredAvailabilityCondition {
  dayTypeRef: string;
  isAvailable?: boolean | null;
  startTime?: string | null;
  endTime?: string | null;
  dayOffset?: number | null;
}

/**
 * A condition as the editor holds it.
 *
 * `endOfDay` and `nextDay` replace `dayOffset` for the two cases the editor
 * understands. `keptDayOffset` holds any other stored offset, so that a save
 * writes it back unchanged.
 */
export interface AvailabilityConditionRow {
  dayTypeRef: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
  endOfDay: boolean;
  nextDay: boolean;
  keptDayOffset?: number;
}

const toTime = (value?: string | null): string =>
  value ? value.slice(0, TIME_LENGTH) : "";

/** True when the span ends on a later day than it starts. */
export const endsBefore = (startTime: string, endTime: string): boolean =>
  Boolean(startTime) && Boolean(endTime) && endTime < startTime;

export const availabilityConditionToRow = (
  stored: StoredAvailabilityCondition,
): AvailabilityConditionRow => {
  const startTime = toTime(stored.startTime);
  const endTime = toTime(stored.endTime);
  const dayOffset = stored.dayOffset ?? SAME_DAY_OFFSET;
  const endOfDay = endTime === MIDNIGHT && dayOffset === NEXT_DAY_OFFSET;
  const nextDay =
    !endOfDay &&
    dayOffset === NEXT_DAY_OFFSET &&
    endsBefore(startTime, endTime);
  const row: AvailabilityConditionRow = {
    dayTypeRef: stored.dayTypeRef,
    isAvailable: stored.isAvailable ?? true,
    startTime,
    endTime,
    endOfDay,
    nextDay,
  };

  if (dayOffset !== SAME_DAY_OFFSET && !endOfDay && !nextDay) {
    row.keptDayOffset = dayOffset;
  }

  return row;
};

export const newAvailabilityConditionRow = (): AvailabilityConditionRow => ({
  dayTypeRef: "",
  isAvailable: true,
  startTime: MIDNIGHT,
  endTime: MIDNIGHT,
  endOfDay: true,
  nextDay: false,
});

/** Maps an editor row to the Tiamat input. A closed row carries no times. */
export const availabilityConditionToInput = (
  row: AvailabilityConditionRow,
): StoredAvailabilityCondition => {
  const input: StoredAvailabilityCondition = {
    dayTypeRef: row.dayTypeRef,
    isAvailable: row.isAvailable,
  };

  if (!row.isAvailable) {
    return input;
  }

  input.startTime = row.startTime;

  if (row.endOfDay) {
    input.endTime = END_OF_DAY_INPUT;
    return input;
  }

  input.endTime = row.endTime;

  if (row.keptDayOffset !== undefined) {
    input.dayOffset = row.keptDayOffset;
  } else if (endsBefore(row.startTime, row.endTime)) {
    input.dayOffset = NEXT_DAY_OFFSET;
  }

  return input;
};

/** Describes why a row cannot be saved, or null when it can. */
export type AvailabilityConditionError = "dayType" | "times" | null;

export const availabilityConditionError = (
  row: AvailabilityConditionRow,
): AvailabilityConditionError => {
  if (!row.dayTypeRef) {
    return "dayType";
  }

  if (!row.isAvailable || row.keptDayOffset !== undefined) {
    return null;
  }

  if (!row.startTime || (!row.endOfDay && !row.endTime)) {
    return "times";
  }

  if (!row.endOfDay && row.startTime === row.endTime) {
    return "times";
  }

  return null;
};

/** True when any parking holds a row that cannot be saved. */
export const hasInvalidAvailabilityConditions = (
  parkings: { availabilityConditions?: AvailabilityConditionRow[] }[] = [],
): boolean =>
  parkings.some((parking) =>
    (parking.availabilityConditions ?? []).some(
      (row) => availabilityConditionError(row) !== null,
    ),
  );
