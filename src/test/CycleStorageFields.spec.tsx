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

import { configureStore, UnknownAction } from "@reduxjs/toolkit";
import "@testing-library/jest-dom/vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import * as types from "../actions/Types";
import { ParkingPanel } from "../components/modern/EditStopPage/components/ParkingPanel";
import Parking from "../models/Parking";
import enMessages from "../static/lang/en.json";

const parkAndRide = (cycleStorage: object[] | null, extra: object = {}) => ({
  id: "NSR:Parking:6",
  name: { value: "Parking" },
  parkingType: "parkAndRide",
  parkingVehicleTypes: ["pedalCycle"],
  totalCapacity: 10,
  placeEquipments: cycleStorage && { cycleStorageEquipment: cycleStorage },
  ...extra,
});

const bikeParking = (cycleStorage: object[] | null) => ({
  id: "NSR:Parking:5",
  name: { value: "Bike" },
  parkingVehicleTypes: ["pedalCycle"],
  totalCapacity: 72,
  placeEquipments: cycleStorage && { cycleStorageEquipment: cycleStorage },
});

const renderPanel = (tiamatParking: object, canEdit = true) => {
  const store = configureStore({
    reducer: (state: UnknownAction[] = [], action: UnknownAction) =>
      action.type.startsWith("@@") ? state : [...state, action],
  });
  render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={enMessages}>
        <ParkingPanel
          parkingIndex={0}
          stopPlace={{
            name: "Stop place",
            parking: [new Parking(tiamatParking).toClient()],
          }}
          canEdit={canEdit}
          onBack={vi.fn()}
          onDelete={vi.fn()}
          onNameChange={vi.fn()}
          onTypeChange={vi.fn()}
          onCapacityChange={vi.fn()}
        />
      </IntlProvider>
    </Provider>,
  );
  return () => store.getState();
};

const rows = () => screen.queryAllByTestId("parking-cycle-storage-entry");

describe("CycleStorageFields - the modern cycle storage editor", () => {
  test("a park-and-ride panel shows one row for each stored entry", () => {
    renderPanel(
      parkAndRide([
        { cycleStorageType: "bars" },
        { cycleStorageType: "racks", numberOfSpaces: 10 },
      ]),
    );

    expect(rows()).toHaveLength(2);
    expect(within(rows()[0]).getByText("Bars")).toBeInTheDocument();
    expect(within(rows()[1]).getByLabelText("Spaces")).toHaveValue(10);
  });

  test("a bike panel shows the rows too", () => {
    renderPanel(bikeParking([{ cycleStorageType: "bars" }]));

    expect(rows()).toHaveLength(1);
    expect(
      screen.getByRole("button", {
        name: enMessages["parking_cycle_storage_add"],
      }),
    ).toBeInTheDocument();
  });

  test("a parking with no cycle storage shows the add button only", () => {
    renderPanel(parkAndRide(null));

    expect(rows()).toHaveLength(0);
    expect(
      screen.getByRole("button", {
        name: enMessages["parking_cycle_storage_add"],
      }),
    ).toBeInTheDocument();
  });

  test("a stored value outside the profile shows its label, and the menu holds three types", () => {
    renderPanel(parkAndRide([{ cycleStorageType: "other" }]));

    expect(
      within(rows()[0]).getByText(
        enMessages["parking_cycle_storage_type_other"],
      ),
    ).toBeInTheDocument();

    fireEvent.mouseDown(within(rows()[0]).getByRole("combobox"));
    const options = screen.getAllByRole("option").map((o) => o.textContent);

    expect(options).toEqual(["Racks", "Bars", "Railings"]);
  });

  test("the keyboard closes the menu of a stored value outside the profile", async () => {
    renderPanel(parkAndRide([{ cycleStorageType: "other" }]));

    fireEvent.mouseDown(within(rows()[0]).getByRole("combobox"));
    fireEvent.keyDown(document.activeElement as Element, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  });

  test("a menu for a profile value holds exactly three types", () => {
    renderPanel(parkAndRide([{ cycleStorageType: "bars" }]));

    fireEvent.mouseDown(within(rows()[0]).getByRole("combobox"));

    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  test("add, change and remove dispatch their actions", () => {
    const actions = renderPanel(
      parkAndRide([{ cycleStorageType: "bars", numberOfSpaces: 3 }]),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: enMessages["parking_cycle_storage_add"],
      }),
    );
    fireEvent.change(within(rows()[0]).getByLabelText("Spaces"), {
      target: { value: "5" },
    });
    fireEvent.click(
      within(rows()[0]).getByRole("button", {
        name: enMessages["parking_cycle_storage_remove"],
      }),
    );

    expect(actions()).toEqual([
      { type: types.ADDED_PARKING_CYCLE_STORAGE, payload: { index: 0 } },
      {
        type: types.CHANGED_PARKING_CYCLE_STORAGE,
        payload: {
          index: 0,
          entryIndex: 0,
          field: "numberOfSpaces",
          value: "5",
        },
      },
      {
        type: types.REMOVED_PARKING_CYCLE_STORAGE,
        payload: { index: 0, entryIndex: 0 },
      },
    ]);
  });

  test("a negative count becomes zero", () => {
    const actions = renderPanel(
      parkAndRide([{ cycleStorageType: "bars", numberOfSpaces: 3 }]),
    );

    fireEvent.change(within(rows()[0]).getByLabelText("Spaces"), {
      target: { value: "-4" },
    });

    expect(actions()[0].payload).toMatchObject({ value: "0" });
  });

  test("an editor without edit rights sees the rows and cannot change them", () => {
    renderPanel(parkAndRide([{ cycleStorageType: "bars" }]), false);

    expect(rows()).toHaveLength(1);
    expect(within(rows()[0]).getByLabelText("Spaces")).toBeDisabled();
    expect(
      within(rows()[0]).getByRole("button", {
        name: enMessages["parking_cycle_storage_remove"],
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: enMessages["parking_cycle_storage_add"],
      }),
    ).toBeDisabled();
  });
});
