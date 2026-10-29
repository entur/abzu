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
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import React from "react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import * as types from "../actions/Types";
import { OpeningHoursFields } from "../components/modern/EditStopPage/components/OpeningHoursFields";
import { OpeningHoursRow } from "../components/modern/EditStopPage/components/OpeningHoursRow";
import { StopPlaceActionBar } from "../components/modern/EditStopPage/components/StopPlaceActionBar";
import { Parking, StopPlace } from "../components/modern/EditStopPage/types";
import { Config, ConfigContext } from "../config/ConfigContext";
import {
  AvailabilityConditionRow,
  availabilityConditionToRow,
} from "../models/availabilityCondition";
import enMessages from "../static/lang/en.json";

const DAY_TYPES = [
  { ref: "FSR:DayType:BusinessDay", label: { en: "Business day" } },
  { ref: "FSR:DayType:Saturday", label: { en: "Saturday" } },
];

const normalRow = (): AvailabilityConditionRow =>
  availabilityConditionToRow({
    dayTypeRef: "FSR:DayType:BusinessDay",
    startTime: "08:00",
    endTime: "16:00",
  });

const overnightRow = (): AvailabilityConditionRow =>
  availabilityConditionToRow({
    dayTypeRef: "FSR:DayType:BusinessDay",
    startTime: "22:00",
    endTime: "06:00",
    dayOffset: 1,
  });

const endOfDayRow = (): AvailabilityConditionRow =>
  availabilityConditionToRow({
    dayTypeRef: "FSR:DayType:BusinessDay",
    startTime: "08:00",
    endTime: "00:00",
    dayOffset: 1,
  });

const keptOffsetRow = (): AvailabilityConditionRow =>
  availabilityConditionToRow({
    dayTypeRef: "FSR:DayType:BusinessDay",
    startTime: "08:00",
    endTime: "16:00",
    dayOffset: 2,
  });

const KEPT_OFFSET_CAPTION = "Ends 2 days later. Change it with a NeTEx import.";

const createStore = () => {
  const dispatch: any = vi.fn((action: unknown) =>
    typeof action === "function" ? action(dispatch) : action,
  );
  return { dispatch, getState: () => ({}), subscribe: () => () => {} };
};

const renderWithProviders = (
  ui: React.ReactElement,
  config: Config = { parkingConfig: { dayTypes: DAY_TYPES } },
  store = createStore(),
) => {
  const result = render(
    <Provider store={store as any}>
      <ConfigContext.Provider value={config}>
        <IntlProvider locale="en" messages={enMessages}>
          {ui}
        </IntlProvider>
      </ConfigContext.Provider>
    </Provider>,
  );
  return { ...result, store };
};

const renderRow = (
  condition: AvailabilityConditionRow,
  dayTypes = DAY_TYPES,
) => {
  const onChange = vi.fn();
  const onDelete = vi.fn();
  renderWithProviders(
    <OpeningHoursRow
      condition={condition}
      dayTypes={dayTypes}
      locale="en"
      disabled={false}
      isDuplicate={false}
      onChange={onChange}
      onDelete={onDelete}
    />,
  );
  return { onChange, onDelete };
};

const parkingWith = (rows: AvailabilityConditionRow[]): Parking =>
  ({ availabilityConditions: rows }) as unknown as Parking;

const actionsOfType = (store: ReturnType<typeof createStore>, type: string) =>
  store.dispatch.mock.calls
    .map(([action]: [any]) => action)
    .filter((action: any) => action?.type === type);

describe("OpeningHoursRow - next day caption", () => {
  test("an overnight row shows the next day caption", () => {
    renderRow(overnightRow());
    expect(screen.getByText("(next day)")).toBeInTheDocument();
  });

  test("a normal row does not show the next day caption", () => {
    renderRow(normalRow());
    expect(screen.queryByText("(next day)")).not.toBeInTheDocument();
  });

  test("an end of day row does not show the next day caption", () => {
    renderRow(endOfDayRow());
    expect(screen.queryByText("(next day)")).not.toBeInTheDocument();
  });
});

describe("OpeningHoursRow - end of day", () => {
  test("unchecking End of day clears the until time", () => {
    const { onChange } = renderRow(endOfDayRow());
    const checkbox = screen.getByRole("checkbox", { name: "End of day" });
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      endOfDay: false,
      nextDay: false,
      endTime: "",
    });
  });

  test("checking End of day sets the until time to midnight", () => {
    const { onChange } = renderRow(normalRow());

    fireEvent.click(screen.getByRole("checkbox", { name: "End of day" }));

    expect(onChange).toHaveBeenCalledWith({
      endOfDay: true,
      nextDay: false,
      endTime: "00:00",
    });
  });
});

describe("OpeningHoursRow - partial time input", () => {
  const fromHours = () =>
    within(screen.getByRole("group", { name: "From" })).getByRole(
      "spinbutton",
      { name: "Hours" },
    );

  test("a complete time change reports the new time", () => {
    const { onChange } = renderRow(normalRow());

    fireEvent.click(fromHours());
    fireEvent.keyDown(fromHours(), { key: "ArrowUp" });

    expect(onChange).toHaveBeenCalledWith({
      startTime: "09:00",
      nextDay: false,
    });
  });

  test("clearing a complete time reports an empty time", () => {
    const { onChange } = renderRow(normalRow());

    fireEvent.click(fromHours());
    fireEvent.keyDown(fromHours(), { key: "Delete" });

    expect(onChange).toHaveBeenCalledWith({ startTime: "", nextDay: false });
  });
});

describe("OpeningHoursRow - kept day offset", () => {
  test("the time inputs and End of day are disabled", () => {
    renderRow(keptOffsetRow());

    expect(keptOffsetRow().keptDayOffset).toBe(2);
    expect(screen.getByRole("checkbox", { name: "End of day" })).toBeDisabled();
    for (const name of ["From", "Until"]) {
      const group = screen.getByRole("group", { name });
      for (const section of within(group).getAllByRole("spinbutton")) {
        expect(section).toHaveAttribute("aria-disabled", "true");
      }
    }
  });

  test("a 00:00 end with dayOffset 2 is a kept offset, not end of day", () => {
    renderRow(
      availabilityConditionToRow({
        dayTypeRef: "FSR:DayType:BusinessDay",
        startTime: "08:00",
        endTime: "00:00",
        dayOffset: 2,
      }),
    );

    expect(
      screen.getByRole("checkbox", { name: "End of day" }),
    ).not.toBeChecked();
    expect(screen.getByText(KEPT_OFFSET_CAPTION)).toBeInTheDocument();
  });

  test("the caption names the offset for a kept offset row", () => {
    renderRow(keptOffsetRow());

    expect(screen.getByText(KEPT_OFFSET_CAPTION)).toBeInTheDocument();
  });

  test("the caption is absent for end of day, next day and normal rows", () => {
    for (const row of [endOfDayRow(), overnightRow(), normalRow()]) {
      renderRow(row);
      expect(screen.queryByText(/days later/)).not.toBeInTheDocument();
      cleanup();
    }
  });

  test("a normal row has enabled time inputs", () => {
    renderRow(normalRow());

    const group = screen.getByRole("group", { name: "From" });
    for (const section of within(group).getAllByRole("spinbutton")) {
      expect(section).toHaveAttribute("aria-disabled", "false");
    }
  });
});

describe("OpeningHoursRow - day type", () => {
  test("shows a select when the config lists day types", () => {
    renderRow(normalRow());

    const select = screen.getByRole("combobox");
    expect(select).toHaveTextContent("Business day");
    expect(screen.queryByRole("textbox", { name: "Day type" })).toBeNull();
  });

  test("shows read-only text when the config lists no day types", () => {
    renderRow(normalRow(), []);

    const text = screen.getByRole("textbox", { name: "Day type" });
    expect(text).toHaveValue("FSR:DayType:BusinessDay");
    expect(text).toHaveAttribute("readonly");
    expect(screen.queryByRole("combobox")).toBeNull();
  });
});

describe("OpeningHoursFields", () => {
  test("shows the read-only day type without a parkingConfig key", () => {
    renderWithProviders(
      <OpeningHoursFields
        parking={parkingWith([normalRow()])}
        parkingIndex={0}
        fieldDisabled={false}
      />,
      {},
    );

    expect(screen.getByRole("textbox", { name: "Day type" })).toHaveAttribute(
      "readonly",
    );
    expect(screen.queryByRole("combobox")).toBeNull();
  });

  test("Add is disabled without parkingConfig day types", () => {
    renderWithProviders(
      <OpeningHoursFields
        parking={parkingWith([])}
        parkingIndex={0}
        fieldDisabled={false}
      />,
      {},
    );

    expect(
      screen.getByRole("button", { name: "Add opening hours" }),
    ).toBeDisabled();
  });

  test("Add is enabled with parkingConfig day types", () => {
    renderWithProviders(
      <OpeningHoursFields
        parking={parkingWith([])}
        parkingIndex={0}
        fieldDisabled={false}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Add opening hours" }),
    ).toBeEnabled();
  });

  test("shows the select with a parkingConfig day type list", () => {
    renderWithProviders(
      <OpeningHoursFields
        parking={parkingWith([normalRow()])}
        parkingIndex={0}
        fieldDisabled={false}
      />,
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("an empty list shows the empty message", () => {
    renderWithProviders(
      <OpeningHoursFields
        parking={parkingWith([])}
        parkingIndex={0}
        fieldDisabled={false}
      />,
    );

    expect(screen.getByText("No opening hours recorded")).toBeInTheDocument();
  });

  test("unchecking End of day dispatches a change for that row only", () => {
    const { store } = renderWithProviders(
      <OpeningHoursFields
        parking={parkingWith([normalRow(), endOfDayRow()])}
        parkingIndex={3}
        fieldDisabled={false}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox", { name: "End of day" });
    fireEvent.click(checkboxes[1]);

    const changes = actionsOfType(
      store,
      types.CHANGED_PARKING_AVAILABILITY_CONDITION,
    );
    expect(changes).toHaveLength(1);
    expect(changes[0].payload).toEqual({
      index: 3,
      conditionIndex: 1,
      changes: { endOfDay: false, nextDay: false, endTime: "" },
    });
  });
});

describe("StopPlaceActionBar - Save with invalid opening hours", () => {
  const stopPlaceWith = (rows: AvailabilityConditionRow[]): StopPlace =>
    ({
      id: "NSR:StopPlace:1",
      name: "Stop",
      stopPlaceType: "onstreetBus",
      parking: [parkingWith(rows)],
    }) as unknown as StopPlace;

  const renderBar = (stopPlace: StopPlace) =>
    renderWithProviders(
      <StopPlaceActionBar
        stopPlace={stopPlace}
        canEdit
        canDelete
        isModified
        onOpenTerminateDialog={() => {}}
        onOpenUndoDialog={() => {}}
        onOpenSaveDialog={() => {}}
      />,
    );

  const saveButton = () => screen.getByRole("button", { name: /save/i });

  test("Save is enabled when every row is valid", () => {
    renderBar(stopPlaceWith([normalRow()]));
    expect(saveButton()).toBeEnabled();
  });

  test("Save is disabled while a row has no day type", () => {
    renderBar(stopPlaceWith([normalRow(), { ...normalRow(), dayTypeRef: "" }]));
    expect(saveButton()).toBeDisabled();
  });

  test("Save is disabled while until equals from", () => {
    renderBar(stopPlaceWith([{ ...normalRow(), endTime: "08:00" }]));
    expect(saveButton()).toBeDisabled();
  });

  test("Save is enabled again after the invalid row is fixed", () => {
    const { rerender } = renderBar(
      stopPlaceWith([{ ...normalRow(), endTime: "" }]),
    );
    expect(saveButton()).toBeDisabled();

    rerender(
      <Provider store={createStore() as any}>
        <ConfigContext.Provider value={{}}>
          <IntlProvider locale="en" messages={enMessages}>
            <StopPlaceActionBar
              stopPlace={stopPlaceWith([normalRow()])}
              canEdit
              canDelete
              isModified
              onOpenTerminateDialog={() => {}}
              onOpenUndoDialog={() => {}}
              onOpenSaveDialog={() => {}}
            />
          </IntlProvider>
        </ConfigContext.Provider>
      </Provider>,
    );
    expect(saveButton()).toBeEnabled();
  });
});
