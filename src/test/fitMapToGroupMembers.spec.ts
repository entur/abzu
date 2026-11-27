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

import { describe, expect, test, vi } from "vitest";
import { fitMapToGroupMembers } from "../components/modern/GroupOfStopPlaces/utils/fitMapToGroupMembers";

const active = (lat: number, lng: number) => ({
  location: [lat, lng] as [number, number],
});
const expired = (lat: number, lng: number) => ({
  ...active(lat, lng),
  hasExpired: true,
});

describe("fitMapToGroupMembers (F-89, S-5)", () => {
  test("fits the drawn members, clear of the drawer", () => {
    const map = { fitBounds: vi.fn() };
    fitMapToGroupMembers(
      map,
      [active(58.1, 7.9), active(58.2, 8.0)],
      false,
      450,
    );

    const [bounds, options] = map.fitBounds.mock.calls[0];
    expect(bounds).toEqual([
      [7.9, 58.1],
      [8.0, 58.2],
    ]);
    expect(options.padding.left).toBe(options.padding.right + 450);
  });

  test("leaves expired members out unless expired stops are shown", () => {
    const map = { fitBounds: vi.fn() };
    const members = [active(58.1, 7.9), expired(60, 11)];

    fitMapToGroupMembers(map, members, false, 0);
    expect(map.fitBounds.mock.calls[0][0]).toEqual([
      [7.9, 58.1],
      [7.9, 58.1],
    ]);

    fitMapToGroupMembers(map, members, true, 0);
    expect(map.fitBounds.mock.calls[1][0]).toEqual([
      [7.9, 58.1],
      [11, 60],
    ]);
  });

  test("doesn't move the map when no member has a location", () => {
    const map = { fitBounds: vi.fn() };
    fitMapToGroupMembers(map, [{ location: null }], false, 0);
    expect(map.fitBounds).not.toHaveBeenCalled();
  });
});
