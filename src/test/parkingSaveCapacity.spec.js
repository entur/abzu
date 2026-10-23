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

const entry = (fields) => ({
  parkingVehicleType: null,
  parkingUserType: null,
  parkingStayType: null,
  numberOfSpaces: null,
  numberOfSpacesWithRechargePoint: null,
  ...fields,
});

const saveParkAndRide = (fields) =>
  helpers.mapParkingToVariables(
    [
      {
        parkingType: PARKING_TYPE.PARK_AND_RIDE,
        hasFullFieldSet: true,
        ...fields,
      },
    ],
    "NSR:StopPlace:1",
  )[0];

describe("mapParkingToVariables - a park-and-ride save sends every capacity row", () => {
  test("sends each row in order with all five fields", () => {
    const capacityEntries = [
      entry({
        parkingVehicleType: "car",
        parkingUserType: "allUsers",
        parkingStayType: "longTerm",
        numberOfSpaces: 247,
        numberOfSpacesWithRechargePoint: 6,
      }),
      entry({
        parkingVehicleType: "motorcycle",
        parkingUserType: "allUsers",
        numberOfSpaces: 10,
      }),
      entry({ parkingUserType: "staff", numberOfSpaces: 7 }),
    ];

    const saved = saveParkAndRide({ capacityEntries });

    expect(spacesOf(saved)).toEqual(capacityEntries);
  });

  test("an unedited save leaves the stored total unchanged", () => {
    // Tiamat sets the total to the sum of the entries a save sends.
    const stored = [
      {
        spaces: [
          { parkingUserType: "registeredDisabled", numberOfSpaces: 2 },
          {
            parkingUserType: "allUsers",
            parkingVehicleType: "car",
            numberOfSpaces: 247,
          },
          {
            parkingUserType: "allUsers",
            parkingVehicleType: "motorcycle",
            numberOfSpaces: 10,
          },
        ],
      },
    ];

    const client = new Parking({
      parkingType: PARKING_TYPE.PARK_AND_RIDE,
      parkingVehicleTypes: ["car", "motorcycle"],
      totalCapacity: 259,
      parkingProperties: stored,
    }).toClient();

    const saved = helpers.mapParkingToVariables([client], "NSR:StopPlace:1")[0];

    const total = spacesOf(saved).reduce(
      (sum, space) => sum + (space.numberOfSpaces || 0),
      0,
    );
    expect(total).toBe(259);
    expect(spacesOf(saved)).toEqual(stored[0].spaces.map(entry));
  });

  test("two entries with the same vehicle type and user type both load and both save", () => {
    const stored = [
      {
        spaces: [
          entry({
            parkingVehicleType: "car",
            parkingUserType: "allUsers",
            numberOfSpaces: 30,
          }),
          entry({
            parkingVehicleType: "car",
            parkingUserType: "allUsers",
            numberOfSpaces: 5,
          }),
        ],
      },
    ];
    const client = new Parking({
      parkingType: PARKING_TYPE.PARK_AND_RIDE,
      parkingVehicleTypes: ["car"],
      totalCapacity: 35,
      parkingProperties: stored,
    }).toClient();

    expect(client.capacityEntries).toHaveLength(2);

    client.capacityEntries[1].numberOfSpaces = "6";
    const saved = helpers.mapParkingToVariables([client], "NSR:StopPlace:1")[0];

    expect(spacesOf(saved).map((space) => space.numberOfSpaces)).toEqual([
      30, 6,
    ]);
  });

  test("three saves in a row do not change the stored entries or the total", () => {
    // Each round stores what the save sent, as Tiamat does, and reloads it.
    let stored = {
      parkingType: PARKING_TYPE.PARK_AND_RIDE,
      parkingVehicleTypes: ["car", "motorcycle"],
      totalCapacity: 259,
      parkingProperties: [
        {
          spaces: [
            entry({
              parkingVehicleType: "car",
              parkingUserType: "allUsers",
              numberOfSpaces: 247,
              numberOfSpacesWithRechargePoint: 6,
            }),
            entry({
              parkingVehicleType: "motorcycle",
              parkingUserType: "allUsers",
              numberOfSpaces: 10,
            }),
            entry({ parkingUserType: "registeredDisabled", numberOfSpaces: 2 }),
          ],
        },
      ],
    };
    const original = JSON.parse(JSON.stringify(stored.parkingProperties));

    for (let round = 0; round < 3; round++) {
      const client = new Parking(stored).toClient();
      const saved = helpers.mapParkingToVariables(
        [client],
        "NSR:StopPlace:1",
      )[0];
      stored = {
        ...stored,
        parkingProperties: saved.parkingProperties,
        totalCapacity: spacesOf(saved).reduce(
          (sum, space) => sum + (space.numberOfSpaces || 0),
          0,
        ),
      };
    }

    expect(stored.totalCapacity).toBe(259);
    expect(stored.parkingProperties).toEqual(original);
  });

  test("an edited count reaches only its own row", () => {
    const saved = saveParkAndRide({
      capacityEntries: [
        entry({ parkingUserType: "allUsers", numberOfSpaces: "32" }),
        entry({ parkingUserType: "registeredDisabled", numberOfSpaces: 3 }),
      ],
    });

    expect(spacesOf(saved).map((space) => space.numberOfSpaces)).toEqual([
      32, 3,
    ]);
  });

  test("a cleared count becomes null, not zero", () => {
    const saved = saveParkAndRide({
      capacityEntries: [
        entry({
          parkingUserType: "allUsers",
          numberOfSpaces: "",
          numberOfSpacesWithRechargePoint: 4,
        }),
      ],
    });

    expect(findSpace(saved, "allUsers")).toEqual(
      entry({
        parkingUserType: "allUsers",
        numberOfSpacesWithRechargePoint: 4,
      }),
    );
  });

  test("removing every row sends an empty list, so Tiamat clears the stored entries", () => {
    const saved = saveParkAndRide({
      capacityEntries: [],
      parkingProperties: [
        { spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 40 }] },
      ],
    });

    expect(saved.parkingProperties).toEqual([{ spaces: [] }]);
  });

  test("a parking with no rows and no stored entries sends no parking properties", () => {
    // Without parking properties in the input, Tiamat keeps the stored total.
    const saved = saveParkAndRide({ capacityEntries: [], totalCapacity: 40 });

    expect(saved.parkingProperties).toBeUndefined();
  });

  test("keeps the other parking properties and their fields", () => {
    const saved = saveParkAndRide({
      capacityEntries: [
        entry({ parkingUserType: "allUsers", numberOfSpaces: 5 }),
      ],
      parkingProperties: [
        { id: "first", spaces: [] },
        { id: "second", spaces: [{ parkingUserType: "staff" }] },
      ],
    });

    expect(saved.parkingProperties).toEqual([
      {
        id: "first",
        spaces: [entry({ parkingUserType: "allUsers", numberOfSpaces: 5 })],
      },
      { id: "second", spaces: [{ parkingUserType: "staff" }] },
    ]);
  });

  test("a bicycle parking save keeps a registeredDisabled entry", () => {
    const [parking] = helpers.mapParkingToVariables(
      [
        {
          parkingType: PARKING_TYPE.BIKE_PARKING,
          hasFullFieldSet: false,
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
      hasFullFieldSet: false,
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
        hasFullFieldSet: false,
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
      hasFullFieldSet: false,
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
      hasFullFieldSet: false,
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

  test("two allUsers entries keep their counts over repeated saves", () => {
    let properties = [
      {
        spaces: [
          {
            parkingUserType: "allUsers",
            parkingVehicleType: "pedalCycle",
            numberOfSpaces: 5,
          },
          {
            parkingUserType: "allUsers",
            parkingVehicleType: "motorcycle",
            numberOfSpaces: 3,
          },
        ],
      },
    ];
    let totalCapacity = 8;

    for (let round = 0; round < 3; round += 1) {
      const saved = save({
        parkingType: PARKING_TYPE.BIKE_PARKING,
        hasFullFieldSet: false,
        totalCapacity,
        parkingProperties: properties,
      });
      properties = saved.parkingProperties;
      totalCapacity = tiamatTotal(saved);
    }

    expect(totalCapacity).toBe(8);
    expect(properties[0].spaces.map((space) => space.numberOfSpaces)).toEqual([
      5, 3,
    ]);
  });

  test("a missing total keeps the stored allUsers count", () => {
    const saved = save({
      parkingType: PARKING_TYPE.BIKE_PARKING,
      hasFullFieldSet: false,
      totalCapacity: null,
      parkingProperties: [
        {
          spaces: [
            { parkingUserType: "allUsers", numberOfSpaces: 20 },
            { parkingUserType: "registeredDisabled", numberOfSpaces: 3 },
          ],
        },
      ],
    });

    expect(findSpace(saved, "allUsers").numberOfSpaces).toBe(20);
    expect(tiamatTotal(saved)).toBe(23);
  });
});

describe("mapParkingToVariables - a save adds no count the data does not hold", () => {
  const roundTrip = (tiamatParking) =>
    helpers.mapParkingToVariables(
      [new Parking(tiamatParking).toClient()],
      "NSR:StopPlace:3",
    )[0];

  test("an unedited save adds no registeredDisabled entry", () => {
    const saved = roundTrip({
      parkingType: PARKING_TYPE.PARK_AND_RIDE,
      parkingVehicleTypes: ["pedalCycle"],
      totalCapacity: 40,
      parkingProperties: [
        { spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 40 }] },
      ],
    });

    expect(spacesOf(saved)).toEqual([
      entry({ parkingUserType: "allUsers", numberOfSpaces: 40 }),
    ]);
  });

  test("a parking with no stored entries saves no entries", () => {
    const saved = roundTrip({
      parkingType: PARKING_TYPE.PARK_AND_RIDE,
      parkingVehicleTypes: ["car"],
      totalCapacity: 25,
      parkingProperties: [],
    });

    expect(saved.parkingProperties).toBeUndefined();
  });
});

describe("mapParkingToVariables - the editor and the save use one rule", () => {
  test("a parking that shows the reduced field set saves its capacity", () => {
    // No stored type and no vehicle type: the editor shows the one capacity
    // field, so the save must write that capacity.
    const client = new Parking({
      parkingVehicleTypes: [],
      totalCapacity: 10,
      parkingProperties: [
        { spaces: [{ parkingUserType: "allUsers", numberOfSpaces: 10 }] },
      ],
    }).toClient();

    const [saved] = helpers.mapParkingToVariables(
      [{ ...client, totalCapacity: 15 }],
      "NSR:StopPlace:4",
    );

    expect(client.hasFullFieldSet).toBe(false);
    expect(findSpace(saved, "allUsers").numberOfSpaces).toBe(15);
  });
});

describe("mapParkingToVariables - a car parking with no stored type", () => {
  const stored = {
    id: "NSR:Parking:10",
    parkingVehicleTypes: ["car"],
    parkingLayout: "openSpace",
    totalCapacity: 21,
    parkingProperties: [
      {
        spaces: [
          {
            parkingUserType: "allUsers",
            numberOfSpaces: 20,
            numberOfSpacesWithRechargePoint: 0,
          },
          { parkingUserType: "registeredDisabled", numberOfSpaces: 1 },
        ],
      },
    ],
  };

  test("keeps entries with no vehicle type and its total over three saves", () => {
    // Each round stores what the save sent, as Tiamat does, and reloads it.
    let current = stored;
    let saved;
    for (let round = 0; round < 3; round++) {
      saved = helpers.mapParkingToVariables(
        [new Parking(current).toClient()],
        "NSR:StopPlace:1",
      )[0];
      current = {
        ...current,
        parkingProperties: saved.parkingProperties,
        totalCapacity: spacesOf(saved).reduce(
          (sum, space) => sum + (space.numberOfSpaces || 0),
          0,
        ),
      };
    }

    expect(current.totalCapacity).toBe(21);
    expect(spacesOf(saved)).toEqual([
      entry({
        parkingUserType: "allUsers",
        numberOfSpaces: 20,
        numberOfSpacesWithRechargePoint: 0,
      }),
      entry({ parkingUserType: "registeredDisabled", numberOfSpaces: 1 }),
    ]);
  });

  test("does not send a parking type", () => {
    const saved = helpers.mapParkingToVariables(
      [new Parking(stored).toClient()],
      "NSR:StopPlace:1",
    )[0];

    expect(saved).not.toHaveProperty("parkingType");
  });
});
