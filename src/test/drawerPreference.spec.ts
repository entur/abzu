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

import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getDrawerPreference,
  setDrawerPreference,
  subscribeToDrawerOpen,
} from "../components/modern/Shared/drawerPreference";

const STORAGE_KEY = "stopPlace.drawerOpen";

describe("drawer preference (F-10d)", () => {
  beforeEach(() => localStorage.clear());

  test("the drawer starts open on a first visit", () => {
    expect(getDrawerPreference()).toBe(true);
  });

  test("a change is stored and tells everything that follows the drawer", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToDrawerOpen(listener);
    setDrawerPreference(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("false");
    expect(getDrawerPreference()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    setDrawerPreference(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
