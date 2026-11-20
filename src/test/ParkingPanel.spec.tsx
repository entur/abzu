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
import { fireEvent, render, screen, within } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import { ParkingPanel } from "../components/modern/EditStopPage/components/ParkingPanel";
import Parking from "../models/Parking";
import enMessages from "../static/lang/en.json";

const bicycleParkingWithoutStoredType = {
  id: "NSR:Parking:5",
  name: { value: "Bicycle parking" },
  parkingVehicleTypes: ["pedalCycle"],
  totalCapacity: 72,
  parkingProperties: [
    { spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 72 }] },
  ],
};

const carAndMotorcycleParkAndRide = {
  id: "NSR:Parking:6",
  name: { value: "Car and motorcycle parking" },
  parkingType: "parkAndRide",
  parkingVehicleTypes: ["car", "motorcycle"],
  totalCapacity: 100,
  parkingProperties: [
    {
      spaces: [
        {
          parkingUserType: "allUsers",
          parkingVehicleType: "car",
          numberOfSpaces: 50,
        },
        {
          parkingUserType: "allUsers",
          parkingVehicleType: "motorcycle",
          numberOfSpaces: 50,
        },
      ],
    },
  ],
};

const renderPanel = (tiamatParking: object, clientOverrides: object = {}) => {
  const store = configureStore({ reducer: () => ({}) });
  render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={enMessages}>
        <ParkingPanel
          parkingIndex={0}
          stopPlace={{
            name: "Stop place",
            parking: [
              { ...new Parking(tiamatParking).toClient(), ...clientOverrides },
            ],
          }}
          canEdit
          onBack={vi.fn()}
          onDelete={vi.fn()}
          onNameChange={vi.fn()}
          onTypeChange={vi.fn()}
          onCapacityChange={vi.fn()}
        />
      </IntlProvider>
    </Provider>,
  );
};

describe("ParkingPanel - the capacity fields follow the field set", () => {
  test("a bicycle parking with no stored type shows one capacity field and no rows", () => {
    renderPanel(bicycleParkingWithoutStoredType);

    expect(screen.getByLabelText("Total capacity")).toHaveValue(72);
    expect(screen.queryAllByTestId("parking-capacity-entry")).toHaveLength(0);
    expect(screen.queryByText("Add capacity row")).toBeNull();
  });

  test("a park-and-ride parking shows one row for each entry and no single capacity field", () => {
    renderPanel(carAndMotorcycleParkAndRide);

    expect(screen.getAllByTestId("parking-capacity-entry")).toHaveLength(2);
    expect(screen.queryByLabelText("Total capacity")).toBeNull();
  });
});

describe("ParkingPanel - operator reference", () => {
  test("limits the input to the 255 characters Tiamat stores", () => {
    renderPanel(carAndMotorcycleParkAndRide);

    expect(screen.getByLabelText("Operator reference")).toHaveAttribute(
      "maxlength",
      "255",
    );
  });

  const HELPER_TEXT =
    "Codespace (3 capital letters) + :Operator: + the operator's ID. Example: ABC:Operator:123";
  const ERROR_TEXT =
    "Not a valid reference. Use the codespace (3 capital letters), then :Operator:, then an ID of letters, digits, - or _. Example: ABC:Operator:123";
  const withReference = (organisationRef: string) => ({
    ...carAndMotorcycleParkAndRide,
    organisationRef,
  });

  test("always shows the expected format as helper text", () => {
    renderPanel(withReference("FSR:Operator:0201256-6"));

    expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
    expect(screen.queryByText(ERROR_TEXT)).toBeNull();
  });

  test("shows an error when the editor changed the value to an invalid one", () => {
    renderPanel(withReference("nonsense"), { organisationRefChanged: true });

    expect(screen.getByLabelText("Operator reference")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByText(ERROR_TEXT)).toBeInTheDocument();
  });

  test("shows no error for an invalid stored value the editor did not change", () => {
    renderPanel(withReference("nonsense"), { organisationRefChanged: false });

    expect(screen.getByLabelText("Operator reference")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
    expect(screen.queryByText(ERROR_TEXT)).toBeNull();
  });

  test("shows no error when the editor changed the value to a valid one", () => {
    renderPanel(withReference("FSR:Operator:0201256-6"), {
      organisationRefChanged: true,
    });

    expect(screen.getByLabelText("Operator reference")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  test("shows no error when the editor cleared the value", () => {
    renderPanel(withReference(""), { organisationRefChanged: true });

    expect(screen.getByLabelText("Operator reference")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });
});

describe("ParkingPanel - step-free access", () => {
  test("offers only the NeTEx Nordic limitation values, with no empty choice", () => {
    renderPanel(carAndMotorcycleParkAndRide);

    const stepFreeControl = screen
      .getByText("Step free access", { selector: "label" })
      .closest(".MuiFormControl-root") as HTMLElement;
    fireEvent.mouseDown(within(stepFreeControl).getByRole("combobox"));
    const options = within(screen.getByRole("listbox"))
      .getAllByRole("option")
      .map((option) => option.textContent);

    expect(options).toEqual([
      "Step free access",
      "Accessible only by steps",
      "Step access unknown",
    ]);
  });
});
