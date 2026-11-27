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
import { KeyValueRow } from "../components/modern/EditStopPage/components/KeyValueRow";
import enMessages from "../static/lang/en.json";

const keyValue = {
  key: "imported-id",
  values: ["NSB:StopPlace:1", "RUT:StopPlace:2"],
};

const renderRow = (disabled: boolean, onRemove = vi.fn()) =>
  render(
    <IntlProvider locale="en" messages={enMessages}>
      <KeyValueRow
        keyValue={keyValue}
        disabled={disabled}
        onEdit={vi.fn()}
        onRemove={onRemove}
      />
    </IntlProvider>,
  );

describe("KeyValueRow (F-72, F-73)", () => {
  test("shows the key, its values and a red delete-for-good button", () => {
    const onRemove = vi.fn();
    renderRow(false, onRemove);
    expect(screen.getByText("imported-id")).toBeInTheDocument();
    expect(screen.getByText("RUT:StopPlace:2")).toBeInTheDocument();
    const remove = screen.getByRole("button", { name: enMessages.remove });
    expect(
      remove.querySelector("[data-testid=DeleteForeverIcon]"),
    ).toBeInTheDocument();
    expect(remove.className).toContain("colorError");
    fireEvent.click(remove);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test("read-only rows have no buttons", () => {
    renderRow(true);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
