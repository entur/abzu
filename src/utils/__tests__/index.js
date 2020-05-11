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
});
