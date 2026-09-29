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

import Parking from "../models/Parking";
import { parkingLayouts } from "../models/parkingLayout";

const baseParking = (overrides = {}) => ({
  id: "NSR:Parking:1",
  name: { value: "Test parking" },
  parkingVehicleTypes: ["car"],
  parkingProperties: [],
  totalCapacity: 40,
  ...overrides,
});

describe("Parking model - layout enumeration", () => {
  test("holds every value Tiamat's ParkingLayoutEnumeration holds", () => {
    expect(parkingLayouts.slice().sort()).toEqual(
      [
        "covered",
        "cycleHire",
        "multistorey",
        "openSpace",
        "other",
        "roadside",
        "undefined",
        "underground",
      ].sort(),
    );
  });
});

describe("Parking model - toClient carries the facility fields", () => {
  test("carries secure, lighting and parentSiteRef", () => {
    const client = new Parking(
      baseParking({
        secure: true,
        lighting: "wellLit",
        parentSiteRef: "NSR:StopPlace:7",
      }),
    ).toClient();

    expect(client.secure).toBe(true);
    expect(client.lighting).toBe("wellLit");
    expect(client.parentSiteRef).toBe("NSR:StopPlace:7");
  });

  test("leaves the facility fields undefined when Tiamat holds none", () => {
    const client = new Parking(baseParking()).toClient();

    expect(client.secure).toBeUndefined();
    expect(client.lighting).toBeUndefined();
    expect(client.parentSiteRef).toBeUndefined();
  });
});
