/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { MarkerSizePicker } from "../components/modern/Map/markerSize/MarkerSizePicker";
import {
  DEFAULT_MARKER_SIZE,
  getMarkerSizePreference,
  setMarkerSizePreference,
  subscribeToMarkerSize,
} from "../components/modern/Map/markerSize/markerSizePreference";
import enMessages from "../static/lang/en.json";

const STORAGE_KEY = "modern.markerSize";

describe("marker size preference", () => {
  beforeEach(() => localStorage.clear());

  test("a first-time user gets Medium", () => {
    expect(DEFAULT_MARKER_SIZE).toBe("medium");
    expect(getMarkerSizePreference()).toBe("medium");
  });

  test("an unknown stored value falls back to Medium", () => {
    localStorage.setItem(STORAGE_KEY, "huge");
    expect(getMarkerSizePreference()).toBe("medium");
  });

  test("a choice is stored and tells listeners", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToMarkerSize(listener);
    setMarkerSizePreference("large");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("large");
    expect(getMarkerSizePreference()).toBe("large");
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    setMarkerSizePreference("small");
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe("MarkerSizePicker", () => {
  beforeEach(() => localStorage.clear());

  const renderPicker = () =>
    render(
      <IntlProvider locale="en" messages={enMessages}>
        <MarkerSizePicker />
      </IntlProvider>,
    );

  test("Medium is chosen by default, and Large can be picked", () => {
    renderPicker();
    const medium = screen.getByRole("button", {
      name: enMessages.marker_size_medium,
    });
    const large = screen.getByRole("button", {
      name: enMessages.marker_size_large,
    });
    expect(medium).toHaveAttribute("aria-pressed", "true");
    expect(large).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(large);
    expect(large).toHaveAttribute("aria-pressed", "true");
    expect(medium).toHaveAttribute("aria-pressed", "false");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("large");
  });

  test("clicking the chosen size again keeps it", () => {
    renderPicker();
    const medium = screen.getByRole("button", {
      name: enMessages.marker_size_medium,
    });
    fireEvent.click(medium);
    expect(medium).toHaveAttribute("aria-pressed", "true");
  });
});
