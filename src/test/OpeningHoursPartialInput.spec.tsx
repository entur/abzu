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
import moment from "moment";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import { OpeningHoursFields } from "../components/modern/EditStopPage/components/OpeningHoursFields";
import { OpeningHoursRow } from "../components/modern/EditStopPage/components/OpeningHoursRow";
import { Parking } from "../components/modern/EditStopPage/types";
import { availabilityConditionToRow } from "../models/availabilityCondition";
import enMessages from "../static/lang/en.json";

/*
 * jsdom cannot produce a partial time with the real TimePicker: MUI reports
 * a partial value only in a browser. This stub calls `onChange` the way MUI
 * does for a partial input (an invalid moment) and for a cleared input (null),
 * so the row's own handling is tested on its own.
 */
vi.mock("@mui/x-date-pickers", () => ({
  TimePicker: ({
    label,
    onChange,
  }: {
    label: string;
    onChange: (value: moment.Moment | null) => void;
  }) => (
    <div>
      <button
        onClick={() => onChange(moment.invalid())}
      >{`${label} partial`}</button>
      <button onClick={() => onChange(null)}>{`${label} cleared`}</button>
      <button
        onClick={() => onChange(moment("09:30", "HH:mm"))}
      >{`${label} complete`}</button>
    </div>
  ),
}));

const row = () =>
  availabilityConditionToRow({
    dayTypeRef: "FSR:DayType:BusinessDay",
    startTime: "08:00",
    endTime: "16:00",
  });

const withProviders = (ui: React.ReactElement, dispatch = vi.fn()) =>
  render(
    <Provider
      store={
        { dispatch, getState: () => ({}), subscribe: () => () => {} } as any
      }
    >
      <IntlProvider locale="en" messages={enMessages}>
        {ui}
      </IntlProvider>
    </Provider>,
  );

describe("OpeningHoursRow - partial TimePicker input", () => {
  const renderRow = () => {
    const onChange = vi.fn();
    withProviders(
      <OpeningHoursRow
        condition={row()}
        dayTypes={[]}
        locale="en"
        disabled={false}
        isDuplicate={false}
        onChange={onChange}
        onDelete={() => {}}
      />,
    );
    return onChange;
  };

  test("a partial from time does not change the state", () => {
    const onChange = renderRow();
    fireEvent.click(screen.getByText("From partial"));
    expect(onChange).not.toHaveBeenCalled();
  });

  test("a partial until time does not change the state", () => {
    const onChange = renderRow();
    fireEvent.click(screen.getByText("Until partial"));
    expect(onChange).not.toHaveBeenCalled();
  });

  test("a cleared time empties the field", () => {
    const onChange = renderRow();
    fireEvent.click(screen.getByText("From cleared"));
    expect(onChange).toHaveBeenCalledWith({ startTime: "", nextDay: false });
  });

  test("a complete time is reported", () => {
    const onChange = renderRow();
    fireEvent.click(screen.getByText("Until complete"));
    expect(onChange).toHaveBeenCalledWith({ endTime: "09:30", nextDay: false });
  });
});

describe("OpeningHoursFields - partial TimePicker input", () => {
  test("a partial time dispatches no action", () => {
    const dispatch: any = vi.fn((action: unknown) =>
      typeof action === "function" ? action(dispatch) : action,
    );
    withProviders(
      <OpeningHoursFields
        parking={{ availabilityConditions: [row()] } as unknown as Parking}
        parkingIndex={0}
        fieldDisabled={false}
      />,
      dispatch,
    );

    fireEvent.click(screen.getByText("From partial"));

    expect(dispatch).not.toHaveBeenCalled();
  });

  test("a complete time dispatches one change", () => {
    const dispatch: any = vi.fn((action: unknown) =>
      typeof action === "function" ? action(dispatch) : action,
    );
    withProviders(
      <OpeningHoursFields
        parking={{ availabilityConditions: [row()] } as unknown as Parking}
        parkingIndex={0}
        fieldDisabled={false}
      />,
      dispatch,
    );

    fireEvent.click(screen.getByText("From complete"));

    // one thunk, plus the action it dispatches
    expect(dispatch).toHaveBeenCalledTimes(2);
  });
});
