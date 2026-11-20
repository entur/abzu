import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLastMapLocation } from "../components/modern/Header/hooks/useLastMapLocation";
import { useLastReportsLocation } from "../components/modern/Header/hooks/useLastReportsLocation";

const routerState = { pathname: "/", search: "" };

vi.mock("../store/hooks", () => ({
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ router: { location: routerState } }),
}));

const visit = (pathname: string, search: string, rerender: () => void) => {
  routerState.pathname = pathname;
  routerState.search = search;
  rerender();
};

describe.each([
  { base: "/ui/", prefix: "/ui", guard: false },
  { base: "/", prefix: "", guard: true },
])("last location hooks under base $base", ({ base, prefix, guard }) => {
  const suiteName = guard ? "(regression guard) " : "";

  beforeEach(() => {
    vi.stubEnv("BASE_URL", base);
    routerState.pathname = "/";
    routerState.search = "";
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it(`${suiteName}the map getter never returns the Reports route`, () => {
    const { result, rerender } = renderHook(() => useLastMapLocation());

    visit(`${prefix}/stop_place/X`, "?a=1", rerender);
    visit(`${prefix}/reports`, "?q=1", rerender);

    expect(result.current()).toBe(`${prefix}/stop_place/X?a=1`);
  });

  it(`${suiteName}the map getter defaults to the overview`, () => {
    const { result } = renderHook(() => useLastMapLocation());

    expect(result.current()).toBe(`${prefix}/`);
  });

  it(`${suiteName}the reports getter returns the last visited query`, () => {
    const { result, rerender } = renderHook(() => useLastReportsLocation());

    expect(result.current()).toBe(`${prefix}/reports`);

    visit(`${prefix}/reports`, "?q=1", rerender);
    visit(`${prefix}/stop_place/X`, "", rerender);

    expect(result.current()).toBe(`${prefix}/reports?q=1`);
  });
});
