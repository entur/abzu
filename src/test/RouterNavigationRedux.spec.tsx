import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { HistoryRouter } from "redux-first-history/rr6";
import { afterEach, describe, expect, it } from "vitest";
import { history, store } from "../store/store";
import { useNavigate } from "react-router-dom";

const BASENAMES = ["/", "/ui"];
const TARGET_ROUTE = "/reports?stopPlaceName=abc";
const NAVIGATE_BUTTON = "navigate";

const NavigateButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(TARGET_ROUTE)}>{NAVIGATE_BUTTON}</button>
  );
};

describe.each(BASENAMES)(
  "router navigation updates Redux under basename %s",
  (basename) => {
    afterEach(() => {
      act(() => history.push("/"));
    });

    it("keeps the URL and state.router.location in step", () => {
      const prefix = basename === "/" ? "" : basename;
      act(() => history.push(`${prefix}/`));
      render(
        <Provider store={store}>
          <HistoryRouter basename={basename} history={history}>
            <NavigateButton />
          </HistoryRouter>
        </Provider>,
      );

      fireEvent.click(screen.getByText(NAVIGATE_BUTTON));

      expect(window.location.pathname + window.location.search).toBe(
        prefix + TARGET_ROUTE,
      );
      const { pathname, search } = store.getState().router.location as any;
      expect(pathname + search).toBe(prefix + TARGET_ROUTE);
    });
  },
);
