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
import { describe, expect, test, vi } from "vitest";
import { CollapsibleSectionHeader } from "../components/modern/Shared/CollapsibleSectionHeader";

const renderHeader = (expanded = false) => {
  const onToggle = vi.fn();
  const onAttach = vi.fn();
  render(
    <CollapsibleSectionHeader
      icon={<span />}
      title="Barn"
      count={2}
      expanded={expanded}
      onToggle={onToggle}
      action={{
        label: "Koble til",
        tooltip: "Legg til stoppested",
        icon: <span />,
        onClick: onAttach,
      }}
    />,
  );
  return {
    onToggle,
    onAttach,
    header: screen.getByRole("button", { name: /Barn/ }),
  };
};

describe("CollapsibleSectionHeader (F-33, F-34)", () => {
  test("the whole header toggles, by mouse and by keyboard", () => {
    const { onToggle, header } = renderHeader();
    expect(header).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(header);
    fireEvent.keyDown(header, { key: "Enter" });
    fireEvent.keyDown(header, { key: " " });
    fireEvent.keyDown(header, { key: "a" });
    expect(onToggle).toHaveBeenCalledTimes(3);
  });

  test("the action has a visible label and doesn't toggle the section", () => {
    const { onToggle, onAttach } = renderHeader(true);
    fireEvent.click(screen.getByRole("button", { name: "Koble til" }));
    expect(onAttach).toHaveBeenCalledTimes(1);
    expect(onToggle).not.toHaveBeenCalled();
  });

  test("the chevron is the last element", () => {
    const { header } = renderHeader(true);
    const last = header.lastElementChild;
    expect(last?.getAttribute("data-testid")).toBe("ExpandLessIcon");
  });
});
