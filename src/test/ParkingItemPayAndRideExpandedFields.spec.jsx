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
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { describe, expect, test, vi } from "vitest";
import ParkingItemPayAndRideExpandedFields from "../components/EditStopPage/ParkingItemPayAndRideExpandedFields";
import enMessages from "../static/lang/en.json";

const baseProps = {
  disabled: false,
  hasExpired: false,
  parkingLayout: null,
  parkingPaymentProcess: [],
  rechargingAvailable: false,
  totalCapacity: 50,
  numberOfSpaces: 40,
  numberOfSpacesWithRechargePoint: 0,
  numberOfSpacesForRegisteredDisabledUserType: 4,
  numberOfSpacesIsAmbiguous: false,
  numberOfSpacesForRegisteredDisabledUserTypeIsAmbiguous: false,
  handleSetParkingLayout: vi.fn(),
  handleSetParkingPaymentProcess: vi.fn(),
  handleSetRechargingAvailable: vi.fn(),
  handleSetNumberOfSpaces: vi.fn(),
  handleSetNumberOfSpacesWithRechargePoint: vi.fn(),
  handleSetNumberOfSpacesForRegisteredDisabledUserType: vi.fn(),
  stepFreeAccess: "unknown",
  handleStepFreeChange: vi.fn(),
};

const renderWithIntl = (props) =>
  render(
    <IntlProvider locale="en" messages={enMessages}>
      <ParkingItemPayAndRideExpandedFields {...baseProps} {...props} />
    </IntlProvider>,
  );

describe("ParkingItemPayAndRideExpandedFields - ambiguous entries stay read-only", () => {
  test("the number of spaces field is editable when Tiamat holds one allUsers entry", () => {
    renderWithIntl({ numberOfSpacesIsAmbiguous: false });

    expect(
      screen.getByLabelText(enMessages["parking_number_of_spaces"]),
    ).toBeEnabled();
  });

  test("the number of spaces field is disabled when Tiamat holds more than one allUsers entry", () => {
    renderWithIntl({ numberOfSpacesIsAmbiguous: true });

    expect(
      screen.getByLabelText(enMessages["parking_number_of_spaces"]),
    ).toBeDisabled();
  });

  test("the registered disabled field is disabled only when that user type is ambiguous", () => {
    renderWithIntl({
      numberOfSpacesIsAmbiguous: false,
      numberOfSpacesForRegisteredDisabledUserTypeIsAmbiguous: true,
    });

    expect(
      screen.getByLabelText(enMessages["parking_number_of_spaces"]),
    ).toBeEnabled();
    expect(
      screen.getByLabelText(
        enMessages[
          "parking_number_of_spaces_for_registered_disabled_user_type"
        ],
      ),
    ).toBeDisabled();
  });
});
