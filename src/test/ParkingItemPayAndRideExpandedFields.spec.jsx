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
import { describe, expect, test, vi } from "vitest";
import ParkingItemPayAndRideExpandedFields from "../components/EditStopPage/ParkingItemPayAndRideExpandedFields";
import enMessages from "../static/lang/en.json";

const entry = (fields) => ({
  parkingVehicleType: null,
  parkingUserType: null,
  parkingStayType: null,
  numberOfSpaces: null,
  numberOfSpacesWithRechargePoint: null,
  ...fields,
});

const baseProps = () => ({
  disabled: false,
  hasExpired: false,
  parkingLayout: null,
  parkingPaymentProcess: [],
  rechargingAvailable: true,
  totalCapacity: 35,
  capacityEntries: [
    entry({
      parkingVehicleType: "car",
      parkingUserType: "allUsers",
      numberOfSpaces: 30,
    }),
    entry({ parkingUserType: "allUsers", numberOfSpaces: 2 }),
    entry({ parkingUserType: "registeredDisabled", numberOfSpaces: 3 }),
  ],
  handleSetParkingLayout: vi.fn(),
  handleSetParkingPaymentProcess: vi.fn(),
  handleSetRechargingAvailable: vi.fn(),
  handleClearRechargePointCounts: vi.fn(),
  handleChangeCapacityEntry: vi.fn(),
  handleAddCapacityEntry: vi.fn(),
  handleRemoveCapacityEntry: vi.fn(),
  stepFreeAccess: "unknown",
  handleStepFreeChange: vi.fn(),
});

const renderWithIntl = (props) => {
  const allProps = { ...baseProps(), ...props };
  render(
    <IntlProvider locale="en" messages={enMessages}>
      <ParkingItemPayAndRideExpandedFields {...allProps} />
    </IntlProvider>,
  );
  return allProps;
};

const rows = () => screen.getAllByTestId("parking-capacity-entry");

describe("ParkingItemPayAndRideExpandedFields - one row per capacity entry", () => {
  test("shows each stored entry as its own row", () => {
    renderWithIntl();

    expect(rows()).toHaveLength(3);
    expect(
      within(rows()[0]).getByLabelText(enMessages["parking_number_of_spaces"]),
    ).toHaveValue(30);
    expect(
      within(rows()[2]).getByText(
        enMessages["parking_user_type_registeredDisabled"],
      ),
    ).toBeInTheDocument();
  });

  test("shows not assigned for an entry with no vehicle type", () => {
    renderWithIntl();

    expect(
      within(rows()[1]).getByText(enMessages["not_assigned"]),
    ).toBeInTheDocument();
  });

  test("renders no row when the parking holds no capacity entries", () => {
    renderWithIntl({ capacityEntries: undefined });

    expect(screen.queryAllByTestId("parking-capacity-entry")).toHaveLength(0);
    expect(
      screen.getByText(enMessages["parking_capacity_entry_add"]),
    ).toBeInTheDocument();
  });

  test("an edited count reaches the handler with its row index", () => {
    const props = renderWithIntl();

    fireEvent.change(
      within(rows()[1]).getByLabelText(enMessages["parking_number_of_spaces"]),
      { target: { value: "4" } },
    );

    expect(props.handleChangeCapacityEntry).toHaveBeenCalledWith(
      1,
      "numberOfSpaces",
      "4",
    );
  });

  test("the add and remove controls reach their handlers", () => {
    const props = renderWithIntl();

    fireEvent.click(screen.getByText(enMessages["parking_capacity_entry_add"]));
    fireEvent.click(
      within(rows()[2]).getByLabelText(
        enMessages["parking_capacity_entry_remove"],
      ),
    );

    expect(props.handleAddCapacityEntry).toHaveBeenCalledTimes(1);
    expect(props.handleRemoveCapacityEntry).toHaveBeenCalledWith(2);
  });

  test("the recharge count is disabled when recharging is not available", () => {
    renderWithIntl({ rechargingAvailable: false });

    const label = enMessages["parking_number_of_spaces_with_recharge_point"];
    expect(within(rows()[0]).getByLabelText(label)).toBeDisabled();
    expect(
      within(rows()[0]).getByLabelText(enMessages["parking_number_of_spaces"]),
    ).toBeEnabled();
  });

  test("an expired parking shows every row read-only", () => {
    renderWithIntl({ hasExpired: true });

    expect(
      within(rows()[0]).getByLabelText(enMessages["parking_number_of_spaces"]),
    ).toBeDisabled();
  });
});
