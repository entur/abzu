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
import { fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { describe, expect, test, vi } from "vitest";
import RechargingAvailablePopover from "../components/EditStopPage/RechargingAvailablePopover";
import enMessages from "../static/lang/en.json";

const renderPopover = () => {
  const props = {
    disabled: false,
    hasExpired: false,
    rechargingAvailableValue: true,
    handleSetRechargingAvailable: vi.fn(),
    handleClearRechargePointCounts: vi.fn(),
  };
  render(
    <IntlProvider locale="en" messages={enMessages}>
      <RechargingAvailablePopover {...props} />
    </IntlProvider>,
  );
  fireEvent.click(screen.getByRole("button"));
  return props;
};

describe("RechargingAvailablePopover", () => {
  test("choosing available keeps the recharge point counts", () => {
    const props = renderPopover();
    fireEvent.click(
      screen.getByText(enMessages.parking_recharging_available_true),
    );
    expect(props.handleSetRechargingAvailable).toHaveBeenCalledWith(true);
    expect(props.handleClearRechargePointCounts).not.toHaveBeenCalled();
  });

  test("choosing not available clears the recharge point counts", () => {
    const props = renderPopover();
    fireEvent.click(
      screen.getByText(enMessages.parking_recharging_available_false),
    );
    expect(props.handleSetRechargingAvailable).toHaveBeenCalledWith(false);
    expect(props.handleClearRechargePointCounts).toHaveBeenCalledTimes(1);
  });
});
