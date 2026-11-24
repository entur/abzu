import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ModernHeader } from "../components/modern/Header/ModernHeader";

const BASENAMES = ["/", "/ui"];
const MAP_TAB_LABEL = "navigation_map";
const REPORTS_TAB_LABEL = "report_site";
const STOP_ROUTE = "/stop_place/NSR:StopPlace:1";
const REPORTS_SEARCH = "?stopPlaceName=abc";
const LOCATION_PROBE = "location-probe";

const mockConfirmLeave = vi.fn();

vi.mock("../auth/auth", () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));
vi.mock("../store/hooks", () => ({ useAppDispatch: () => vi.fn() }));
vi.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({ user: {} }),
}));
vi.mock("react-intl", () => ({
  useIntl: () => ({ formatMessage: ({ id }: { id: string }) => id }),
}));
vi.mock("react-helmet", () => ({ Helmet: () => null }));
vi.mock("../theme/hooks", () => ({
  useEnvironmentStyles: () => ({ environmentBadge: null, environment: "" }),
  useResponsive: () => ({ isMobile: false }),
}));
vi.mock("../theme/ThemeProvider", () => ({
  useTheme: () => ({ themeConfig: {} }),
}));
vi.mock("../components/modern/Shared/UnsavedChangesGuard", () => ({
  useConfirmLeave: () => mockConfirmLeave,
}));
vi.mock("../components/modern/Header/HeaderSlotContext", () => ({
  useHeaderSlotContent: () => null,
}));
vi.mock(
  "../components/modern/Header/components/NavigationUiModeSwitch",
  () => ({ NavigationUiModeSwitch: () => null }),
);
vi.mock("../components/modern/Header/components", async () => {
  const Nothing = () => null;
  const { NavigationLine } = await vi.importActual<
    typeof import("../components/modern/Header/components/NavigationLine")
  >("../components/modern/Header/components/NavigationLine");
  return {
    AppLogo: Nothing,
    EnvironmentBadge: Nothing,
    HeaderSearch: Nothing,
    HelpControl: Nothing,
    LanguageControl: Nothing,
    NavigationLine,
    SettingsControl: Nothing,
    UserSection: Nothing,
  };
});

const LocationProbe = () => {
  const { pathname, search } = useLocation();
  return <div data-testid={LOCATION_PROBE}>{pathname + search}</div>;
};

const withBasename = (basename: string, route: string): string =>
  basename === "/" ? route : basename + route;

const renderHeaderAt = (basename: string, route: string) =>
  render(
    <MemoryRouter
      basename={basename}
      initialEntries={[withBasename(basename, route)]}
    >
      <ModernHeader config={{}} />
      <LocationProbe />
    </MemoryRouter>,
  );

const currentLocation = (): string =>
  screen.getByTestId(LOCATION_PROBE).textContent ?? "";

describe.each(BASENAMES)("ModernHeader tabs under basename %s", (basename) => {
  beforeEach(() => {
    mockConfirmLeave.mockReset();
    mockConfirmLeave.mockImplementation((proceed: () => void) => proceed());
  });

  it("marks the Reports tab selected on the Reports route", () => {
    renderHeaderAt(basename, "/reports");

    expect(
      screen
        .getByRole("tab", { name: REPORTS_TAB_LABEL })
        .getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("marks the Map tab selected on a stop place route", () => {
    renderHeaderAt(basename, STOP_ROUTE);

    expect(
      screen
        .getByRole("tab", { name: MAP_TAB_LABEL })
        .getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("opens Reports from the Reports tab", () => {
    renderHeaderAt(basename, STOP_ROUTE);

    fireEvent.click(screen.getByRole("tab", { name: REPORTS_TAB_LABEL }));

    expect(currentLocation()).toBe("/reports");
  });

  it("returns to the stop place from the Map tab after a Reports visit", () => {
    renderHeaderAt(basename, STOP_ROUTE);

    fireEvent.click(screen.getByRole("tab", { name: REPORTS_TAB_LABEL }));
    fireEvent.click(screen.getByRole("tab", { name: MAP_TAB_LABEL }));

    expect(currentLocation()).toBe(STOP_ROUTE);
  });

  it("asks for confirmation before the Reports tab navigates", () => {
    mockConfirmLeave.mockImplementation(() => undefined);
    renderHeaderAt(basename, STOP_ROUTE);

    fireEvent.click(screen.getByRole("tab", { name: REPORTS_TAB_LABEL }));

    expect(mockConfirmLeave).toHaveBeenCalledTimes(1);
    expect(currentLocation()).toBe(STOP_ROUTE);
  });

  it("asks for confirmation before the Map tab navigates", () => {
    mockConfirmLeave.mockImplementation(() => undefined);
    renderHeaderAt(basename, `/reports${REPORTS_SEARCH}`);

    fireEvent.click(screen.getByRole("tab", { name: MAP_TAB_LABEL }));

    expect(mockConfirmLeave).toHaveBeenCalledTimes(1);
    expect(currentLocation()).toBe(`/reports${REPORTS_SEARCH}`);
  });
});
