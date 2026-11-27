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

import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ConfigContext, MapConfig } from "../config/ConfigContext";

const ACTIVE_LAYER = "OpenStreetMap";
const dispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
  useSelector: (selector: (state: object) => unknown) =>
    selector({ user: { activeBaselayer: ACTIVE_LAYER } }),
}));

const { MapLayersPanel } =
  await import("../components/modern/Map/controls/MapLayersPanel");

const LAYER_NAMES = [
  "OpenStreetMap",
  "Kartverket topografisk",
  "Esri World Imagery",
];
const mapConfig = {
  baseLayers: LAYER_NAMES.map((name) => ({ name, url: "https://tiles/{z}" })),
  defaultBaseLayer: ACTIVE_LAYER,
} as unknown as MapConfig;

describe("MapLayersPanel (F-27)", () => {
  test("the base maps are a single choice, with only the active one checked", () => {
    render(
      <ConfigContext.Provider value={{ mapConfig }}>
        <MapLayersPanel />
      </ConfigContext.Provider>,
    );
    const rows = screen.getAllByRole("menuitemradio");
    expect(rows).toHaveLength(LAYER_NAMES.length);
    expect(rows.map((row) => row.getAttribute("aria-checked"))).toEqual([
      "true",
      "false",
      "false",
    ]);

    fireEvent.click(
      screen.getByRole("menuitemradio", { name: "Esri World Imagery" }),
    );
    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
