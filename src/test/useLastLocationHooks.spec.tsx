import { act, renderHook } from "@testing-library/react";
import React from "react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { useIsReportsRoute } from "../components/modern/Header/hooks/useIsReportsRoute";
import { useLastMapLocation } from "../components/modern/Header/hooks/useLastMapLocation";
import { useLastReportsLocation } from "../components/modern/Header/hooks/useLastReportsLocation";

const BASENAMES = ["/", "/ui"];
const STOP_ROUTE = "/stop_place/NSR:StopPlace:1";
const GROUP_ROUTE = "/group/NSR:GroupOfStopPlaces:1";
const OVERVIEW_ROUTE = "/";
const REPORTS_ROUTE = "/reports";
const REPORTS_SEARCH = "?stopPlaceName=abc";
const CHANGELOG_ROUTE = "/changelog";

const withBasename = (basename: string, route: string): string =>
  basename === "/" ? route : basename + route;

const renderAtRoute = <T,>(
  basename: string,
  initialRoute: string,
  useHook: () => T,
) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter
      basename={basename}
      initialEntries={[withBasename(basename, initialRoute)]}
    >
      {children}
    </MemoryRouter>
  );
  return renderHook(
    () => ({
      hook: useHook(),
      navigate: useNavigate(),
      location: useLocation(),
    }),
    { wrapper },
  );
};

describe.each(BASENAMES)("route hooks under basename %s", (basename) => {
  it("useIsReportsRoute is true on Reports and false elsewhere", () => {
    const reports = renderAtRoute(basename, REPORTS_ROUTE, useIsReportsRoute);
    const stop = renderAtRoute(basename, STOP_ROUTE, useIsReportsRoute);

    expect(reports.result.current.hook).toBe(true);
    expect(stop.result.current.hook).toBe(false);
  });

  it("useLastMapLocation remembers a stop place route", () => {
    const { result } = renderAtRoute(basename, STOP_ROUTE, useLastMapLocation);

    expect(result.current.hook()).toBe(STOP_ROUTE);
  });

  it("useLastMapLocation remembers a group route", () => {
    const { result } = renderAtRoute(basename, GROUP_ROUTE, useLastMapLocation);

    expect(result.current.hook()).toBe(GROUP_ROUTE);
  });

  it("useLastMapLocation keeps the stop route while Reports shows", () => {
    const { result } = renderAtRoute(basename, STOP_ROUTE, useLastMapLocation);

    act(() => result.current.navigate(REPORTS_ROUTE));

    expect(result.current.hook()).toBe(STOP_ROUTE);
  });

  it("useLastMapLocation ignores a route that is not a map route", () => {
    const { result } = renderAtRoute(basename, STOP_ROUTE, useLastMapLocation);

    act(() => result.current.navigate(CHANGELOG_ROUTE));

    expect(result.current.hook()).toBe(STOP_ROUTE);
  });

  it("useLastMapLocation defaults to the overview", () => {
    const { result } = renderAtRoute(
      basename,
      REPORTS_ROUTE,
      useLastMapLocation,
    );

    expect(result.current.hook()).toBe(OVERVIEW_ROUTE);
  });

  it("useLastReportsLocation remembers the report search", () => {
    const { result } = renderAtRoute(
      basename,
      REPORTS_ROUTE + REPORTS_SEARCH,
      useLastReportsLocation,
    );

    act(() => result.current.navigate(STOP_ROUTE));

    expect(result.current.hook()).toBe(REPORTS_ROUTE + REPORTS_SEARCH);
  });

  it("useLastReportsLocation defaults to the bare Reports page", () => {
    const { result } = renderAtRoute(
      basename,
      STOP_ROUTE,
      useLastReportsLocation,
    );

    expect(result.current.hook()).toBe(REPORTS_ROUTE);
  });
});
