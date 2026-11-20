import { describe, expect, it } from "vitest";
import { stripBasePath } from "../utils/stripBasePath";
import { withBasePath } from "../utils/withBasePath";

describe("withBasePath", () => {
  it.each([
    ["/reports", "/ui/", "/ui/reports"],
    ["/reports?q=1", "/ui/", "/ui/reports?q=1"],
    ["/stop_place/X?a=1", "/ui/", "/ui/stop_place/X?a=1"],
    ["/", "/ui/", "/ui/"],
    ["reports", "/ui/", "/ui/reports"],
    ["/reports", "/ui", "/ui/reports"],
    ["/reports", "/", "/reports"],
    ["/", "/", "/"],
    ["/stop_place/X", "/", "/stop_place/X"],
  ])("maps %s with base %s to %s", (path, basePath, expected) => {
    expect(withBasePath(path, basePath)).toBe(expected);
  });

  it("is the inverse of stripBasePath", () => {
    const full = withBasePath("/reports?q=1", "/ui/");
    expect(stripBasePath(full, "/ui/")).toBe("/reports?q=1");
  });
});
