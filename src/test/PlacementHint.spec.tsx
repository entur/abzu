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
import { describe, expect, test, vi } from "vitest";
import { PlacementHint } from "../components/modern/Map/controls/PlacementHint";
import enMessages from "../static/lang/en.json";

describe("PlacementHint (F-13c)", () => {
  test("says that Esc cancels, and the × names its shortcut", () => {
    const onCancel = vi.fn();
    render(
      <IntlProvider locale="en" messages={enMessages}>
        <PlacementHint
          messageKey="map_creating_stop_hint"
          onCancel={onCancel}
          left={64}
        />
      </IntlProvider>,
    );
    expect(
      screen.getByText(enMessages.placement_escape_hint),
    ).toBeInTheDocument();
    const cancel = screen.getByRole("button", {
      name: enMessages.cancel_with_escape,
    });
    expect(cancel).toHaveAttribute("aria-keyshortcuts", "Escape");
    fireEvent.click(cancel);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
