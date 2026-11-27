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
import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SettingIndicator } from "../components/modern/Shared/SettingIndicator";

const TICK = "[data-testid=CheckIcon]";
const DOT = "[data-testid=radio-dot]";

describe("SettingIndicator", () => {
  test("a checkbox shows a tick only when on", () => {
    const { container, rerender } = render(<SettingIndicator checked />);
    expect(container.querySelector(TICK)).toBeInTheDocument();
    expect(container.querySelector(DOT)).toBeNull();
    rerender(<SettingIndicator checked={false} />);
    expect(container.querySelector(TICK)).toBeNull();
  });

  test("a radio (F-27) shows a dot when on, never a tick", () => {
    const { container, rerender } = render(
      <SettingIndicator checked variant="radio" />,
    );
    expect(container.querySelector("[data-variant=radio]")).toBeInTheDocument();
    expect(container.querySelector(DOT)).toBeInTheDocument();
    expect(container.querySelector(TICK)).toBeNull();
    rerender(<SettingIndicator checked={false} variant="radio" />);
    expect(container.querySelector(DOT)).toBeNull();
  });
});
