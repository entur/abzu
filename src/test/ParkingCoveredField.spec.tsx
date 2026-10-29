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

import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import { ParkingCoveredField } from "../components/modern/EditStopPage/components/ParkingCoveredField";
import enMessages from "../static/lang/en.json";

const dispatch = vi.fn();
const fakeStore = {
  dispatch,
  getState: () => ({}),
  subscribe: () => () => {},
};

describe("ParkingCoveredField - covered select", () => {
  test("A5b: offers an Undefined item and choosing it empties covered", () => {
    dispatch.mockClear();
    render(
      <Provider store={fakeStore as never}>
        <IntlProvider locale="en" messages={enMessages}>
          <ParkingCoveredField
            covered="indoors"
            parkingIndex={0}
            disabled={false}
          />
        </IntlProvider>
      </Provider>,
    );

    fireEvent.mouseDown(screen.getByRole("combobox"));
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Undefined"));

    expect(dispatch).toHaveBeenCalledTimes(1);
    const thunk = dispatch.mock.calls[0][0];
    const inner = vi.fn();
    thunk(inner);
    expect(inner.mock.calls[0][0].payload).toMatchObject({
      index: 0,
      covered: "",
    });
  });

  test("A5b: a closed covered select with an empty value shows Undefined", () => {
    render(
      <Provider store={fakeStore as never}>
        <IntlProvider locale="en" messages={enMessages}>
          <ParkingCoveredField covered="" parkingIndex={0} disabled={false} />
        </IntlProvider>
      </Provider>,
    );

    expect(screen.getByRole("combobox").textContent).toContain("Undefined");
  });
});
