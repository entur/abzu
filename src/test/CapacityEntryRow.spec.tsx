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
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import * as types from "../actions/Types";
import { CapacityEntryRow } from "../components/modern/EditStopPage/components/CapacityEntryRow";
import { CapacityEntry } from "../components/modern/EditStopPage/types";
import enMessages from "../static/lang/en.json";

const entry = (fields: Partial<CapacityEntry>): CapacityEntry => ({
  parkingVehicleType: null,
  parkingUserType: null,
  parkingStayType: null,
  numberOfSpaces: null,
  numberOfSpacesWithRechargePoint: null,
  ...fields,
});

const renderRow = (
  rowEntry: CapacityEntry,
  { disabled = false, rechargingAvailable = true } = {},
) => {
  const store = configureStore({
    reducer: (state: UnknownAction[] = [], action: UnknownAction) =>
      action.type.startsWith("@@") ? state : [...state, action],
  });
  render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={enMessages}>
        <CapacityEntryRow
          entry={rowEntry}
          parkingIndex={2}
          entryIndex={1}
          disabled={disabled}
          rechargingAvailable={rechargingAvailable}
        />
      </IntlProvider>
    </Provider>,
  );
  return () => store.getState();
};

const rechargeField = () =>
  screen.queryByLabelText(
    enMessages["parking_capacity_entry_spaces_with_recharge_point"],
  );

const spacesField = () =>
  screen.getByLabelText(enMessages["parking_capacity_entry_spaces"]);

describe("CapacityEntryRow - the modern capacity row", () => {
  test("shows the stored values of the entry", () => {
    renderRow(
      entry({
        parkingVehicleType: "car",
        parkingUserType: "registeredDisabled",
        numberOfSpaces: 3,
      }),
    );

    expect(spacesField()).toHaveValue(3);
    expect(
      screen.getByText(enMessages["parking_user_type_registeredDisabled"]),
    ).toBeInTheDocument();
  });

  test("shows not assigned for an entry with no vehicle type", () => {
    renderRow(entry({ parkingUserType: "allUsers", numberOfSpaces: 2 }));

    expect(screen.getByText(enMessages["not_assigned"])).toBeInTheDocument();
  });

  test("an edited count dispatches a change for its own parking and row", () => {
    const actions = renderRow(entry({ numberOfSpaces: 30 }));

    fireEvent.change(spacesField(), { target: { value: "32" } });

    expect(actions()).toEqual([
      {
        type: types.CHANGED_PARKING_CAPACITY_ENTRY,
        payload: {
          index: 2,
          entryIndex: 1,
          field: "numberOfSpaces",
          value: "32",
        },
      },
    ]);
  });

  test("a negative count becomes zero", () => {
    const actions = renderRow(entry({ numberOfSpaces: 30 }));

    fireEvent.change(spacesField(), { target: { value: "-4" } });

    expect(actions()[0].payload).toMatchObject({ value: "0" });
  });

  test("the remove control dispatches a removal of its row", () => {
    const actions = renderRow(entry({ numberOfSpaces: 30 }));

    fireEvent.click(
      screen.getByRole("button", {
        name: enMessages["parking_capacity_entry_remove"],
      }),
    );

    expect(actions()).toEqual([
      {
        type: types.REMOVED_PARKING_CAPACITY_ENTRY,
        payload: { index: 2, entryIndex: 1 },
      },
    ]);
  });

  test("the recharge count is hidden when recharging is not available and the entry holds none", () => {
    renderRow(entry({ numberOfSpaces: 30 }), { rechargingAvailable: false });

    expect(rechargeField()).toBeNull();
    expect(spacesField()).toBeEnabled();
  });

  test("a held recharge count stays visible and disabled when recharging is not available", () => {
    renderRow(
      entry({ numberOfSpaces: 30, numberOfSpacesWithRechargePoint: 4 }),
      { rechargingAvailable: false },
    );

    expect(rechargeField()).toBeDisabled();
    expect(rechargeField()).toHaveValue(4);
  });

  test("the recharge count is editable when recharging is available", () => {
    renderRow(entry({ numberOfSpaces: 30 }));

    expect(rechargeField()).toBeEnabled();
  });

  test("a disabled row allows no edit", () => {
    renderRow(entry({ numberOfSpaces: 30 }), { disabled: true });

    expect(spacesField()).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: enMessages["parking_capacity_entry_remove"],
      }),
    ).toBeDisabled();
  });
});
