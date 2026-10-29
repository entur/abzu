import { describe, expect, it } from "vitest";
import { stripBasePath } from "../utils/stripBasePath";

describe("stripBasePath", () => {
  it.each([
    [
      "/ui/stop_place/FSR:StopPlace:925",
      "/ui/",
      "/stop_place/FSR:StopPlace:925",
    ],
    ["/ui/reports", "/ui/", "/reports"],
    ["/ui/", "/ui/", "/"],
    ["/ui", "/ui/", "/"],
    ["/stop_place/X", "/", "/stop_place/X"],
    ["/", "/", "/"],
    ["/uiextra/page", "/ui/", "/uiextra/page"],
    ["/other/page", "/ui/", "/other/page"],
  ])("maps %s with base %s to %s", (pathname, basePath, expected) => {
    expect(stripBasePath(pathname, basePath)).toBe(expected);
  });
});
