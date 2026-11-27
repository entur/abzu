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

import { describe, expect, test } from "vitest";
import {
  FAB_GAP,
  fabLeftFor,
} from "../components/modern/Map/controls/utils/fabPosition";

describe("fabLeftFor (F-10d)", () => {
  test("at the map's edge when no editor is open", () => {
    expect(
      fabLeftFor({ isEditorOpen: false, isDrawerOpen: true, drawerWidth: 450 }),
    ).toBe(FAB_GAP);
  });

  test("next to an open drawer, at its real width", () => {
    expect(
      fabLeftFor({ isEditorOpen: true, isDrawerOpen: true, drawerWidth: 450 }),
    ).toBe(450 + FAB_GAP);
    expect(
      fabLeftFor({ isEditorOpen: true, isDrawerOpen: true, drawerWidth: 380 }),
    ).toBe(380 + FAB_GAP);
  });

  test("beside a collapsed drawer on desktop and tablet: its bar stays", () => {
    expect(
      fabLeftFor({ isEditorOpen: true, isDrawerOpen: false, drawerWidth: 450 }),
    ).toBe(450 + FAB_GAP);
    expect(
      fabLeftFor({ isEditorOpen: true, isDrawerOpen: false, drawerWidth: 380 }),
    ).toBe(380 + FAB_GAP);
  });

  test("at the map's edge once a phone drawer is collapsed", () => {
    expect(
      fabLeftFor({
        isEditorOpen: true,
        isDrawerOpen: false,
        drawerWidth: "100%",
      }),
    ).toBe(FAB_GAP);
  });

  test("hidden while a phone-wide drawer covers the map", () => {
    expect(
      fabLeftFor({
        isEditorOpen: true,
        isDrawerOpen: true,
        drawerWidth: "100%",
      }),
    ).toBeNull();
  });
});
