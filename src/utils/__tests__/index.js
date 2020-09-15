import { getIsCurrentVersionMax } from "..";

describe("getIsCurrentVersionMax", () => {
  test("Is child of parent", () => {
    expect(getIsCurrentVersionMax([], null, true)).toBeTruthy();
  });

  test("No previous versions", () => {
    expect(getIsCurrentVersionMax([], null, false)).toBeTruthy();
  });

  test("No current version (creating a new stop place)", () => {
    expect(getIsCurrentVersionMax([{ version: 1 }], null, false)).toBeTruthy();
  });

  test("Current version is max", () => {
    expect(getIsCurrentVersionMax([{ version: 2 }], "2", false)).toBeTruthy();
  });

  test("Empty toDate has precedence over version number", () => {
    expect(
      getIsCurrentVersionMax(
        [
          { version: 2, toDate: "2010-12-10 19:30" },
          { version: 1, toDate: "" },
        ],
        "1",
        false
      )
    ).toBeTruthy();
  });

  test("Compare toDates", () => {
    expect(
      getIsCurrentVersionMax(
        [
          { version: "10", toDate: "15-09-2020 20:37" },
          { version: "14", toDate: "15-09-2020 09:16" },
        ],
        "10",
        false
      )
    ).toBeTruthy();
  });
});
