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

import helpers from "../modelUtils/mapToQueryVariables";
import Parking from "../models/Parking";
import PARKING_TYPE from "../models/parkingType";

const spacesOf = (parking) => parking.parkingProperties[0].spaces;

beforeAll(() => {
  window.config = { ...window.config, defaultLanguageCode: "nb" };
});

const findSpace = (parking, userType) =>
  spacesOf(parking).find((space) => space.parkingUserType === userType);

describe("mapParkingToVariables - a save keeps the capacity entries it does not edit", () => {
  test("a park-and-ride save keeps a staff entry Abzu cannot edit", () => {
    const [parking] = helpers.mapParkingToVariables(
      [
        {
          parkingType: PARKING_TYPE.PARK_AND_RIDE,
          totalCapacity: 50,
          numberOfSpaces: 50,
          numberOfSpacesForRegisteredDisabledUserType: 4,
          parkingProperties: [
            {
              spaces: [
                { parkingUserType: "allUsers", numberOfSpaces: 40 },
                { parkingUserType: "staff", numberOfSpaces: 7 },
              ],
            },
          ],
        },
      ],
      "NSR:StopPlace:1",
    );

    expect(findSpace(parking, "staff")).toEqual({
      parkingUserType: "staff",
      numberOfSpaces: 7,
    });
    expect(findSpace(parking, "allUsers").numberOfSpaces).toBe(50);
    expect(findSpace(parking, "registeredDisabled").numberOfSpaces).toBe(4);
  });

  test("a bicycle parking save keeps a registeredDisabled entry", () => {
    const [parking] = helpers.mapParkingToVariables(
      [
        {
          parkingType: PARKING_TYPE.BIKE_PARKING,
          totalCapacity: 30,
          parkingProperties: [
            {
              spaces: [
                { parkingUserType: "allUsers", numberOfSpaces: 20 },
                { parkingUserType: "registeredDisabled", numberOfSpaces: 3 },
              ],
            },
          ],
        },
      ],
      "NSR:StopPlace:2",
    );

    expect(findSpace(parking, "registeredDisabled")).toEqual({
      parkingUserType: "registeredDisabled",
      numberOfSpaces: 3,
    });
    // 30 is the total the editor shows. The registeredDisabled entry holds 3 of
    // it, so allUsers holds the remaining 27 and Tiamat's sum stays 30.
    expect(findSpace(parking, "allUsers").numberOfSpaces).toBe(27);
  });

  test("a save keeps a recharge count the edited field does not carry", () => {
    const [parking] = helpers.mapParkingToVariables(
      [
        {
          parkingType: PARKING_TYPE.PARK_AND_RIDE,
          totalCapacity: 50,
          numberOfSpaces: 50,
          parkingProperties: [
            {
              spaces: [
                {
                  parkingUserType: "allUsers",
                  numberOfSpaces: 40,
                  numberOfSpacesWithRechargePoint: 6,
                },
              ],
            },
          ],
        },
      ],
      "NSR:StopPlace:3",
    );

    expect(findSpace(parking, "allUsers")).toEqual({
      parkingUserType: "allUsers",
      numberOfSpaces: 50,
      numberOfSpacesWithRechargePoint: 6,
    });
  });

  test("builds the entries from nothing when Tiamat holds no properties", () => {
    const [parking] = helpers.mapParkingToVariables(
      [
        {
          parkingType: PARKING_TYPE.PARK_AND_RIDE,
          totalCapacity: 10,
          numberOfSpaces: 10,
          numberOfSpacesForRegisteredDisabledUserType: 2,
        },
      ],
      "NSR:StopPlace:4",
    );

    expect(spacesOf(parking)).toEqual([
      { parkingUserType: "allUsers", numberOfSpaces: 10 },
      { parkingUserType: "registeredDisabled", numberOfSpaces: 2 },
    ]);
  });

  test("does not write an entry that would carry no value", () => {
    const [parking] = helpers.mapParkingToVariables(
      [
        {
          parkingType: PARKING_TYPE.PARK_AND_RIDE,
          totalCapacity: 10,
          numberOfSpaces: 10,
        },
      ],
      "NSR:StopPlace:5",
    );

    expect(findSpace(parking, "registeredDisabled")).toBeUndefined();
  });
});

describe("Parking model - the save path needs the original capacity entries", () => {
  test("toClient carries parkingProperties through unchanged", () => {
    const parkingProperties = [
      {
        spaces: [
          { parkingUserType: "allUsers", numberOfSpaces: 40 },
          { parkingUserType: "registeredDisabled", numberOfSpaces: 3 },
          { parkingUserType: "staff", numberOfSpaces: 7 },
        ],
      },
    ];

    const client = new Parking({
      id: "NSR:Parking:9",
      name: { value: "Test parking" },
      parkingVehicleTypes: ["car"],
      totalCapacity: 40,
      parkingProperties,
    }).toClient();

    expect(client.parkingProperties).toEqual(parkingProperties);
  });
});

describe("mapParkingToVariables - a bicycle capacity does not grow on repeated saves", () => {
  // Tiamat ignores the totalCapacity the client sends. It sets totalCapacity to
  // the sum of every space entry instead. These tests model that rule.
  const tiamatTotal = (parking) =>
    parking.parkingProperties[0].spaces.reduce(
      (sum, space) => sum + (Number(space.numberOfSpaces) || 0),
      0,
    );

  const save = (client) =>
    helpers.mapParkingToVariables([client], "NSR:StopPlace:6")[0];

  test("an unedited save leaves the stored total unchanged", () => {
    const stored = [
      {
        spaces: [
          { parkingUserType: "allUsers", numberOfSpaces: 20 },
          { parkingUserType: "registeredDisabled", numberOfSpaces: 3 },
        ],
      },
    ];

    const saved = save({
      parkingType: PARKING_TYPE.BIKE_PARKING,
      totalCapacity: 23,
      parkingProperties: stored,
    });

    expect(tiamatTotal(saved)).toBe(23);
    expect(findSpace(saved, "registeredDisabled").numberOfSpaces).toBe(3);
  });

  test("three saves in a row do not compound the total", () => {
    let properties = [
      {
        spaces: [
          { parkingUserType: "allUsers", numberOfSpaces: 20 },
          { parkingUserType: "registeredDisabled", numberOfSpaces: 3 },
        ],
      },
    ];
    let totalCapacity = 23;

    for (let round = 0; round < 3; round += 1) {
      const saved = save({
        parkingType: PARKING_TYPE.BIKE_PARKING,
        totalCapacity,
        parkingProperties: properties,
      });
      properties = saved.parkingProperties;
      totalCapacity = tiamatTotal(saved);
    }

    expect(totalCapacity).toBe(23);
  });

  test("an edited capacity becomes the new stored total", () => {
    const saved = save({
      parkingType: PARKING_TYPE.BIKE_PARKING,
      totalCapacity: 30,
      parkingProperties: [
        {
          spaces: [
            { parkingUserType: "allUsers", numberOfSpaces: 20 },
            { parkingUserType: "registeredDisabled", numberOfSpaces: 3 },
          ],
        },
      ],
    });

    expect(tiamatTotal(saved)).toBe(30);
    expect(findSpace(saved, "allUsers").numberOfSpaces).toBe(27);
    expect(findSpace(saved, "registeredDisabled").numberOfSpaces).toBe(3);
  });

  test("keeps the vehicle type and the stay type of an entry it does not edit", () => {
    const saved = save({
      parkingType: PARKING_TYPE.BIKE_PARKING,
      totalCapacity: 27,
      parkingProperties: [
        {
          spaces: [
            { parkingUserType: "allUsers", numberOfSpaces: 20 },
            {
              parkingUserType: "staff",
              parkingVehicleType: "car",
              parkingStayType: "longTerm",
              numberOfSpaces: 7,
            },
          ],
        },
      ],
    });

    expect(findSpace(saved, "staff")).toEqual({
      parkingUserType: "staff",
      parkingVehicleType: "car",
      parkingStayType: "longTerm",
      numberOfSpaces: 7,
    });
  });
});
