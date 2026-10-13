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
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";
import { describe, expect, test } from "vitest";
import ParkingItem from "../components/EditStopPage/ParkingItem";
import PARKING_TYPE from "../models/parkingType";
import enMessages from "../static/lang/en.json";

const store = configureStore({ reducer: () => ({}) });

const translations = {
  name: "Name",
  notAsssigned: "Not assigned",
  capacity: "Capacity",
};

const baseParking = {
  id: "NSR:Parking:1",
  name: "Bicycle shed",
  totalCapacity: 30,
  parkingVehicleTypes: ["pedalCycle"],
  hasExpired: false,
};

const renderParkingItem = (parking) =>
  render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={enMessages}>
        <ParkingItem
          translations={translations}
          index={0}
          expanded={true}
          parking={parking}
          parkingType={PARKING_TYPE.BIKE_PARKING}
          handleToggleCollapse={() => {}}
          handleLocateOnMap={() => {}}
        />
      </IntlProvider>
    </Provider>,
  );

describe("ParkingItem - a bicycle parking's capacity field stays read-only when ambiguous", () => {
  test("is editable when Tiamat holds a single allUsers entry", () => {
    renderParkingItem({ ...baseParking, numberOfSpacesIsAmbiguous: false });

    expect(screen.getByLabelText(translations.capacity)).toBeEnabled();
  });

  test("is disabled when Tiamat holds more than one allUsers entry", () => {
    renderParkingItem({ ...baseParking, numberOfSpacesIsAmbiguous: true });

    expect(screen.getByLabelText(translations.capacity)).toBeDisabled();
  });
});
