import { describe, expect, it } from "vitest";
import { toTileZoom } from "./mapZoom";

describe("toTileZoom", () => {
  it("converts MapLibre zoom to the 256 pixel tile zoom Tiamat expects", () => {
    expect(toTileZoom(13)).toBe(14);
    expect(toTileZoom(12.99)).toBe(13);
    expect(toTileZoom(4.5)).toBe(5);
  });
});
