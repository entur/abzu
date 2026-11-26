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
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { beforeEach, describe, expect, test, vi } from "vitest";
import enMessages from "../static/lang/en.json";

type MapHandler = (event?: { originalEvent?: { target: Element } }) => void;
const mapHandlers: Record<string, MapHandler[]> = {};
const fakeMap = {
  on: (event: string, handler: MapHandler) => {
    (mapHandlers[event] ??= []).push(handler);
  },
  off: (event: string, handler: MapHandler) => {
    mapHandlers[event] = (mapHandlers[event] ?? []).filter(
      (registered) => registered !== handler,
    );
  },
};
const fireMapEvent = (event: string, target: Element = document.body) =>
  (mapHandlers[event] ?? []).forEach((handler) =>
    handler({ originalEvent: { target } }),
  );

vi.mock("react-map-gl/maplibre", () => ({
  useMap: () => ({ current: { getMap: () => fakeMap } }),
}));

const { MarkerPopup } =
  await import("../components/modern/Map/markers/MarkerPopup");
const { usePopupFollowsMap } =
  await import("../components/modern/Map/hooks/usePopupFollowsMap");

/** ClickAwayListener only listens from the tick after it mounts. */
const nextTick = () =>
  act(() => new Promise((resolve) => setTimeout(resolve, 0)));

const renderPopup = () => {
  const anchor = document.createElement("div");
  const canvas = document.createElement("canvas");
  canvas.className = "maplibregl-canvas";
  const outsideButton = document.createElement("button");
  document.body.append(anchor, canvas, outsideButton);
  const onClose = vi.fn();
  render(
    <IntlProvider locale="en" messages={enMessages}>
      <MarkerPopup
        anchorEl={anchor}
        onClose={onClose}
        title="Sjøstrand skole"
        id="NSR:StopPlace:24869"
        lat={58.100494}
        lng={7.976486}
      />
    </IntlProvider>,
  );
  return { onClose, canvas, outsideButton };
};

describe("MarkerPopup (F-80)", () => {
  beforeEach(() => {
    Object.keys(mapHandlers).forEach((event) => delete mapHandlers[event]);
    document.body.innerHTML = "";
  });

  test("is not modal: no backdrop over the page", () => {
    renderPopup();
    expect(screen.getByRole("dialog")).toHaveTextContent("Sjøstrand skole");
    expect(document.querySelector(".MuiBackdrop-root")).toBeNull();
    expect(document.querySelector(".MuiModal-root")).toBeNull();
  });

  test("closes with the × button and with Esc", () => {
    const { onClose } = renderPopup();
    fireEvent.click(screen.getByRole("button", { name: enMessages.close }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test("closes on a click elsewhere, e.g. another marker", async () => {
    const { onClose, outsideButton } = renderPopup();
    await nextTick();
    fireEvent.click(outsideButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("a click on the map canvas is left to the map's own click event", async () => {
    const { onClose, canvas } = renderPopup();
    await nextTick();
    fireEvent.click(canvas);
    expect(onClose).not.toHaveBeenCalled();

    fireMapEvent("click", canvas);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("the map click MapLibre also fires for a marker click doesn't close it", async () => {
    const { onClose } = renderPopup();
    const marker = document.createElement("div");
    marker.className = "maplibregl-marker";
    const markerImage = document.createElement("img");
    marker.append(markerImage);
    document.body.append(marker);
    await nextTick();
    fireMapEvent("click", markerImage);
    expect(onClose).not.toHaveBeenCalled();
  });

  test("a click inside the popup keeps it open", async () => {
    const { onClose } = renderPopup();
    await nextTick();
    fireEvent.click(screen.getByText("Sjøstrand skole"));
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("usePopupFollowsMap", () => {
  beforeEach(() => {
    Object.keys(mapHandlers).forEach((event) => delete mapHandlers[event]);
  });

  test("repositions the popup when the map moves, only while open", async () => {
    const update = vi.fn();
    const { result, rerender } = renderHook(
      ({ open }) => usePopupFollowsMap(open),
      { initialProps: { open: true } },
    );
    result.current.current = { update } as never;

    fireMapEvent("move");
    await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    expect(update).toHaveBeenCalledTimes(1);

    rerender({ open: false });
    fireMapEvent("move");
    await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    expect(update).toHaveBeenCalledTimes(1);
  });
});
