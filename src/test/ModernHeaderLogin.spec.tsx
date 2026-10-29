import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ModernHeader } from "../components/modern/Header/ModernHeader";

const LOGIN_BUTTON_LABEL = "test-login";
const REDIRECT_KEY = "redirectAfterLogin";
const BASE_PATH = "/ui/";
const mockLogin = vi.fn();

vi.mock("../auth/auth", () => ({
  useAuth: () => ({ isAuthenticated: false, login: mockLogin }),
}));
vi.mock("../store/hooks", () => ({ useAppDispatch: () => vi.fn() }));
vi.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({ router: { location: { pathname: "/" } }, user: {} }),
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
  useConfirmLeave: () => vi.fn(),
}));
vi.mock("../components/modern/Header/HeaderSlotContext", () => ({
  useHeaderSlotContent: () => null,
}));
vi.mock("../components/modern/Header/hooks/useLastMapLocation", () => ({
  useLastMapLocation: () => vi.fn(),
}));
vi.mock("../components/modern/Header/hooks/useLastReportsLocation", () => ({
  useLastReportsLocation: () => vi.fn(),
}));
vi.mock("../components/modern/Header/components", () => {
  const Nothing = () => null;
  return {
    AppLogo: Nothing,
    EnvironmentBadge: Nothing,
    HeaderSearch: Nothing,
    HelpControl: Nothing,
    LanguageControl: Nothing,
    NavigationLine: Nothing,
    SettingsControl: Nothing,
    UserSection: ({ onLogin }: { onLogin: () => void }) => (
      <button onClick={onLogin}>test-login</button>
    ),
  };
});

describe("ModernHeader login", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockLogin.mockClear();
    vi.stubEnv("BASE_URL", BASE_PATH);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    window.history.pushState({}, "", "/");
  });

  it("stores the return path without the base path and keeps the query", () => {
    window.history.pushState({}, "", "/ui/stop_place/X?tab=1");
    render(<ModernHeader config={{}} />);

    fireEvent.click(screen.getByText(LOGIN_BUTTON_LABEL));

    expect(sessionStorage.getItem(REDIRECT_KEY)).toBe("/stop_place/X?tab=1");
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });
});
