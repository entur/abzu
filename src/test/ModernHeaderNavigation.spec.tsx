import { fireEvent, render, screen } from "@testing-library/react";
import { push } from "redux-first-history";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ModernHeader } from "../components/modern/Header/ModernHeader";

const MAP_TAB_LABEL = "navigation_map";
const REPORTS_TAB_LABEL = "report_site";
const SEARCH_BOX_TEXT = "test-header-search";

const mockDispatch = vi.fn();
const routerState = { pathname: "/", search: "" };

vi.mock("../auth/auth", () => ({
  useAuth: () => ({ isAuthenticated: false, login: vi.fn() }),
}));
vi.mock("../store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ router: { location: routerState } }),
}));
vi.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({ router: { location: routerState }, user: {} }),
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
  useConfirmLeave: () => (action: () => void) => action(),
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
    HeaderSearch: () => <span>{SEARCH_BOX_TEXT}</span>,
    HelpControl: Nothing,
    LanguageControl: Nothing,
    NavigationLine,
    SettingsControl: Nothing,
    UserSection: Nothing,
  };
});

const setLocation = (pathname: string, search = ""): void => {
  routerState.pathname = pathname;
  routerState.search = search;
};

const isSelected = (name: string): boolean =>
  screen.getByRole("tab", { name }).getAttribute("aria-selected") === "true";

const renderHeader = () => render(<ModernHeader config={{}} />);

const pushedPaths = (): string[] =>
  mockDispatch.mock.calls
    .map(([action]) => action)
    .filter((action) => action.type === push("/").type)
    .map((action) => action.payload.args[0]);

describe("ModernHeader navigation tabs", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    setLocation("/");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("under base /ui/", () => {
    beforeEach(() => {
      vi.stubEnv("BASE_URL", "/ui/");
    });

    it("shows the Reports tab as selected and hides the search on /ui/reports", () => {
      setLocation("/ui/reports");
      renderHeader();

      expect(isSelected(REPORTS_TAB_LABEL)).toBe(true);
      expect(screen.queryByText(SEARCH_BOX_TEXT)).toBeNull();
    });

    it("keeps the Map tab selected and the search visible on a stop place", () => {
      setLocation("/ui/stop_place/X");
      renderHeader();

      expect(isSelected(MAP_TAB_LABEL)).toBe(true);
      expect(screen.getByText(SEARCH_BOX_TEXT)).toBeTruthy();
    });

    it("pushes /ui/reports when the Reports tab is clicked", () => {
      setLocation("/ui/stop_place/X", "?a=1");
      renderHeader();

      fireEvent.click(screen.getByRole("tab", { name: REPORTS_TAB_LABEL }));

      expect(pushedPaths()).toEqual(["/ui/reports"]);
    });

    it("pushes a /ui/ path when the Map tab is clicked on Reports", () => {
      setLocation("/ui/reports", "?q=1");
      renderHeader();

      fireEvent.click(screen.getByRole("tab", { name: MAP_TAB_LABEL }));

      expect(pushedPaths()).toEqual(["/ui/"]);
    });
  });

  describe("under base / (regression guard)", () => {
    beforeEach(() => {
      vi.stubEnv("BASE_URL", "/");
    });

    it("shows the Reports tab as selected on /reports", () => {
      setLocation("/reports");
      renderHeader();

      expect(isSelected(REPORTS_TAB_LABEL)).toBe(true);
      expect(screen.queryByText(SEARCH_BOX_TEXT)).toBeNull();
    });

    it("pushes /reports, and / for the Map tab", () => {
      setLocation("/stop_place/X");
      const { unmount } = renderHeader();
      fireEvent.click(screen.getByRole("tab", { name: REPORTS_TAB_LABEL }));
      unmount();

      setLocation("/reports");
      renderHeader();
      fireEvent.click(screen.getByRole("tab", { name: MAP_TAB_LABEL }));

      expect(pushedPaths()).toEqual(["/reports", "/"]);
    });
  });
});
