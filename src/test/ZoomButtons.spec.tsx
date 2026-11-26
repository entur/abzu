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
import { act, fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { beforeEach, describe, expect, test, vi } from "vitest";
import enMessages from "../static/lang/en.json";

const MIN_ZOOM = 0;
const MAX_ZOOM = 19;
const handlers: Record<string, Array<() => void>> = {};
const fakeMap = {
  zoom: 17,
  getZoom: () => fakeMap.zoom,
  getMinZoom: () => MIN_ZOOM,
  getMaxZoom: () => MAX_ZOOM,
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  on: (event: string, handler: () => void) => {
    (handlers[event] ??= []).push(handler);
  },
  off: (event: string, handler: () => void) => {
    handlers[event] = (handlers[event] ?? []).filter((h) => h !== handler);
  },
};

/* Stable, like the real useMap: the same ref on every render. */
const mapContext = { current: { getMap: () => fakeMap } };
vi.mock("react-map-gl/maplibre", () => ({
  useMap: () => mapContext,
}));

const { ZoomButtons } =
  await import("../components/modern/Map/controls/ZoomButtons");

const renderButtons = () =>
  render(
    <IntlProvider locale="en" messages={enMessages}>
      <ZoomButtons buttonSx={{}} />
    </IntlProvider>,
  );

const zoomTo = async (zoom: number) => {
  fakeMap.zoom = zoom;
  await act(async () => {
    (handlers.zoom ?? []).forEach((handler) => handler());
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
};

describe("ZoomButtons (F-01)", () => {
  beforeEach(() => {
    fakeMap.zoom = 17;
    fakeMap.zoomIn.mockClear();
    fakeMap.zoomOut.mockClear();
    Object.keys(handlers).forEach((event) => delete handlers[event]);
  });

  test("zooms the map in and out one step", () => {
    renderButtons();
    fireEvent.click(screen.getByRole("button", { name: enMessages.zoom_in }));
    fireEvent.click(screen.getByRole("button", { name: enMessages.zoom_out }));
    expect(fakeMap.zoomIn).toHaveBeenCalledTimes(1);
    expect(fakeMap.zoomOut).toHaveBeenCalledTimes(1);
  });

  test("disables each direction at the map's zoom limit", async () => {
    renderButtons();
    const zoomIn = screen.getByRole("button", { name: enMessages.zoom_in });
    const zoomOut = screen.getByRole("button", { name: enMessages.zoom_out });
    expect(zoomIn).toBeEnabled();
    expect(zoomOut).toBeEnabled();

    await zoomTo(MAX_ZOOM);
    expect(zoomIn).toBeDisabled();
    expect(zoomOut).toBeEnabled();

    await zoomTo(MIN_ZOOM);
    expect(zoomIn).toBeEnabled();
    expect(zoomOut).toBeDisabled();
  });
});
