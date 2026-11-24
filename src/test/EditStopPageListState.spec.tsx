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

import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom/vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { StopPlaceActions } from "../actions";
import { EditStopPage } from "../components/modern/EditStopPage/EditStopPage";
import mapReducer from "../reducers/mapReducer";
import userReducer from "../reducers/userReducer";
import enMessages from "../static/lang/en.json";

const hookMock = vi.hoisted(() => ({ state: {} as Record<string, unknown> }));

vi.mock("../components/modern/EditStopPage/hooks/useEditStopPage", () => ({
  useEditStopPage: () =>
    new Proxy(hookMock.state, {
      get: (target, key: string) =>
        key in target
          ? target[key]
          : key.startsWith("handle")
            ? () => undefined
            : undefined,
    }),
}));

const makeStop = (id: string, quayCount = 2, parkingCount = 3) => ({
  id,
  name: "Test stop",
  quays: Array.from({ length: quayCount }, (_, i) => ({
    id: `NSR:Quay:${i + 1}`,
    publicCode: `Q${i + 1}`,
  })),
  parking: Array.from({ length: parkingCount }, (_, i) => ({
    id: `NSR:Parking:${i + 1}`,
    name: `Parking ${i + 1}`,
    parkingType: "parkAndRide",
  })),
  permissions: {},
});

let currentStop: ReturnType<typeof makeStop>;
let originalStop: ReturnType<typeof makeStop>;
let scrollIntoView: ReturnType<typeof vi.fn>;

const setHookState = (overrides: Record<string, unknown> = {}) => {
  hookMock.state = {
    stopPlace: currentStop,
    originalStopPlace: originalStop,
    isModified: false,
    canEdit: true,
    canDelete: true,
    versions: [],
    versionsLoading: false,
    ...overrides,
  };
};

const buildStore = () =>
  configureStore({
    reducer: {
      user: userReducer as any,
      mapUtils: mapReducer as any,
      stopPlace: () => ({
        current: currentStop,
        originalCurrent: originalStop,
        enablePublicCodePrivateCodeOnStopPlaces: false,
      }),
    },
    middleware: (getDefault) =>
      getDefault({ serializableCheck: false, immutableCheck: false }),
  });

type TestStore = ReturnType<typeof buildStore>;

const ui = (store: TestStore) => (
  <Provider store={store}>
    <IntlProvider locale="en" messages={enMessages}>
      <EditStopPage open />
    </IntlProvider>
  </Provider>
);

const renderPage = () => {
  const store = buildStore();
  const view = render(ui(store));
  return {
    store,
    rerenderPage: () => view.rerender(ui(store)),
    refreshStore: () =>
      act(() => void store.dispatch({ type: "test/refresh" })),
  };
};

const toggleSection = (name: string) =>
  fireEvent.click(screen.getByText(name, { selector: "h6" }));

const clickBack = () =>
  fireEvent.click(screen.getByRole("button", { name: "Back" }));

const focusElement = (store: TestStore, index: number, type: string) =>
  act(
    () =>
      void store.dispatch(StopPlaceActions.setElementFocus(index, type) as any),
  );

beforeEach(() => {
  currentStop = makeStop("NSR:StopPlace:1");
  originalStop = currentStop;
  setHookState();
  scrollIntoView = vi.fn();
  Element.prototype.scrollIntoView = scrollIntoView as any;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("EditStopPage - the stop panel after Back from a quay or parking", () => {
  test("T1: the parking list stays open", () => {
    renderPage();
    toggleSection("Parking");
    fireEvent.click(screen.getByText("Parking 2"));
    clickBack();

    expect(screen.getByText("Parking 2")).toBeVisible();
  });

  test("T2: the quay list and the parking list stay open", () => {
    renderPage();
    toggleSection("Quays");
    toggleSection("Parking");
    fireEvent.click(screen.getByText("Quay Q1"));
    clickBack();

    expect(screen.getByText("Quay Q1")).toBeVisible();
    expect(screen.getByText("Parking 1")).toBeVisible();
  });

  test("T3: a list opened from a map marker opens, and its row scrolls into view", () => {
    const { store } = renderPage();
    focusElement(store, 1, "parkAndRide");

    clickBack();

    expect(screen.getByText("Parking 2")).toBeVisible();
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
    const scrolledRow = scrollIntoView.mock.contexts[0] as HTMLElement;
    expect(scrolledRow).toContainElement(screen.getByText("Parking 2"));
    expect(scrolledRow).not.toContainElement(screen.getByText("Parking 1"));
  });

  test("T4: opening a different stop closes both lists", async () => {
    const { rerenderPage, refreshStore } = renderPage();
    toggleSection("Quays");
    toggleSection("Parking");
    fireEvent.click(screen.getByText("Parking 2"));
    clickBack();
    expect(screen.getByText("Parking 1")).toBeVisible();

    currentStop = makeStop("NSR:StopPlace:2");
    originalStop = currentStop;
    setHookState();
    refreshStore();
    rerenderPage();

    await waitFor(() => {
      expect(screen.getByText("Quay Q1")).not.toBeVisible();
      expect(screen.getByText("Parking 1")).not.toBeVisible();
    });
  });

  test("T5: a delete from the parking panel keeps the list and does not scroll", () => {
    const { store, rerenderPage } = renderPage();
    toggleSection("Parking");
    fireEvent.click(screen.getByText("Parking 1"));
    const handleConfirmDeleteParking = vi.fn(() => {
      currentStop = {
        ...currentStop,
        parking: currentStop.parking.slice(1),
      };
      setHookState({ handleConfirmDeleteParking });
      store.dispatch({ type: "test/refresh" });
    });
    setHookState({
      deleteParkingDialogOpen: true,
      handleConfirmDeleteParking,
    });
    rerenderPage();

    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Delete parking",
      }),
    );

    expect(handleConfirmDeleteParking).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Parking 2")).toBeVisible();
    expect(screen.getByText("Parking 3")).toBeVisible();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  test("T6: Back on the facilities tab sets no scroll for a later tab change", () => {
    const { store } = renderPage();
    fireEvent.click(screen.getByRole("tab", { name: "Facilities" }));
    focusElement(store, 1, "parkAndRide");
    clickBack();
    expect(screen.getByRole("tab", { name: "Facilities" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    fireEvent.click(screen.getByRole("tab", { name: "Stop place" }));

    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  test("T7: Back clears the map focus", () => {
    const { store } = renderPage();
    toggleSection("Parking");
    fireEvent.click(screen.getByText("Parking 2"));
    expect((store.getState() as any).mapUtils.focusedElement.index).toBe(1);

    clickBack();

    expect((store.getState() as any).mapUtils.focusedElement.index).toBe(-1);
  });

  test("T8: Discard of an unsaved parking keeps the list and does not scroll", () => {
    const { store, rerenderPage } = renderPage();
    toggleSection("Parking");
    fireEvent.click(screen.getByText("Parking 3"));

    currentStop = { ...currentStop, parking: currentStop.parking.slice(0, 2) };
    originalStop = currentStop;
    setHookState();
    act(() => void store.dispatch({ type: "test/refresh" }));
    rerenderPage();

    expect(screen.getByText("Parking 1")).toBeVisible();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
