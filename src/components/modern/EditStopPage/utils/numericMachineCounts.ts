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

interface TicketingEquipment {
  numberOfMachines?: number | string | null;
}

interface WithPlaceEquipments {
  placeEquipments?: { ticketingEquipment?: TicketingEquipment | null } | null;
}

interface StopWithQuays extends WithPlaceEquipments {
  quays?: WithPlaceEquipments[] | null;
}

/**
 * The ticket-machine field (shared with the classic UI) keeps what was typed,
 * a string; Tiamat expects a whole number of at least 0.
 */
export const toMachineCount = (
  value: number | string | null | undefined,
): number | null | undefined => {
  if (value === null || value === undefined) return value;
  if (typeof value === "string" && value.trim() === "") return null;
  const count = Math.trunc(Number(value));
  return Number.isFinite(count) ? Math.max(0, count) : null;
};

const withNumericCount = <T extends WithPlaceEquipments>(element: T): T => {
  const ticketing = element.placeEquipments?.ticketingEquipment;
  if (!ticketing || typeof ticketing.numberOfMachines === "number") {
    return element;
  }
  return {
    ...element,
    placeEquipments: {
      ...element.placeEquipments,
      ticketingEquipment: {
        ...ticketing,
        numberOfMachines: toMachineCount(ticketing.numberOfMachines),
      },
    },
  };
};

/**
 * A copy of the stop for saving, with the stop's and each quay's number of
 * ticket machines as a number instead of the typed text (F-68). The Redux
 * state is left as it is.
 */
export const withNumericMachineCounts = <T extends StopWithQuays>(
  stopPlace: T,
): T => ({
  ...withNumericCount(stopPlace),
  ...(stopPlace.quays ? { quays: stopPlace.quays.map(withNumericCount) } : {}),
});
