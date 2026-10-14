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
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import { ParkAndRideFields } from "../components/modern/EditStopPage/components/ParkAndRideFields";
import ParkingItemPayAndRideExpandedFields from "../components/EditStopPage/ParkingItemPayAndRideExpandedFields";
import enMessages from "../static/lang/en.json";

const renderWithIntl = (ui) =>
  render(
    <IntlProvider locale="en" messages={enMessages}>
      {ui}
    </IntlProvider>,
  );

// A minimal store is enough for `useAppDispatch`/`useDispatch`: react-redux's
// Provider only needs `dispatch`, `getState` and `subscribe`.
const fakeStore = {
  dispatch: vi.fn(),
  getState: () => ({}),
  subscribe: () => () => {},
};

const renderWithIntlAndStore = (ui) =>
  render(
    <Provider store={fakeStore}>
      <IntlProvider locale="en" messages={enMessages}>
        {ui}
      </IntlProvider>
    </Provider>,
  );

const noop = () => {};

describe("ParkingItemPayAndRideExpandedFields - parkingPaymentProcess render", () => {
  test("T7: shows a raw value instead of a message id for a value the editor has no label for", () => {
    renderWithIntl(
      <ParkingItemPayAndRideExpandedFields
        disabled={false}
        hasExpired={false}
        parkingLayout={null}
        parkingPaymentProcess={["voucher"]}
        rechargingAvailable={false}
        totalCapacity={0}
        numberOfSpaces={0}
        numberOfSpacesWithRechargePoint={0}
        numberOfSpacesForRegisteredDisabledUserType={0}
        handleSetParkingLayout={noop}
        handleSetParkingPaymentProcess={noop}
        handleSetRechargingAvailable={noop}
        handleSetNumberOfSpaces={noop}
        handleSetNumberOfSpacesWithRechargePoint={noop}
        handleSetNumberOfSpacesForRegisteredDisabledUserType={noop}
        stepFreeAccess={null}
        handleStepFreeChange={noop}
      />,
    );

    expect(screen.getByText("voucher")).toBeInTheDocument();
  });
});

describe("ParkAndRideFields (modern editor) - parkingPaymentProcess/paymentMethods render", () => {
  test("T7: shows a raw value instead of a message id for parkingPaymentProcess", () => {
    renderWithIntlAndStore(
      <ParkAndRideFields
        parking={{ parkingPaymentProcess: ["voucher"] }}
        parkingIndex={0}
        canEdit={true}
        fieldDisabled={false}
        derivedCapacity={0}
      />,
    );

    expect(screen.getByText("voucher")).toBeInTheDocument();
  });

  test("T7: shows a raw value instead of a message id for paymentMethods", () => {
    renderWithIntlAndStore(
      <ParkAndRideFields
        parking={{ paymentMethods: ["voucher"] }}
        parkingIndex={0}
        canEdit={true}
        fieldDisabled={false}
        derivedCapacity={0}
      />,
    );

    expect(screen.getByText("voucher")).toBeInTheDocument();
  });
});
