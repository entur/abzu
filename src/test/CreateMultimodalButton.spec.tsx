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
import enMessages from "../static/lang/en.json";

const dispatch = vi.fn();
const confirmLeave = vi.fn((proceed: () => void) => proceed());
const config = { modalityConfig: {} as Record<string, boolean> };

vi.mock("../store/hooks", () => ({ useAppDispatch: () => dispatch }));
vi.mock("../config/ConfigContext", () => ({ useConfig: () => config }));
vi.mock("../components/modern/Shared/UnsavedChangesGuard", () => ({
  useConfirmLeave: () => confirmLeave,
}));
vi.mock("../actions", () => ({
  UserActions: {
    createMultimodalWith: (id: string, fromMap: boolean) => ({
      type: "create multimodal",
      id,
      fromMap,
    }),
  },
}));

const { CreateMultimodalButton } =
  await import("../components/modern/EditStopPage/components/CreateMultimodalButton");

const STOP = { id: "NSR:StopPlace:64755" };
const LABEL = enMessages.new__multi_stop;

const renderButton = (stopPlace: object, canEdit = true) =>
  render(
    <IntlProvider locale="en" messages={enMessages}>
      <CreateMultimodalButton stopPlace={stopPlace} canEdit={canEdit} />
    </IntlProvider>,
  );

describe("CreateMultimodalButton (F-12a)", () => {
  beforeEach(() => {
    dispatch.mockClear();
    confirmLeave.mockClear();
    config.modalityConfig = {};
  });

  test("a saved, editable stop can start a multimodal stop, through the unsaved-changes prompt", () => {
    renderButton(STOP);
    fireEvent.click(screen.getByRole("button", { name: LABEL }));
    expect(confirmLeave).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: "create multimodal",
      id: STOP.id,
      fromMap: true,
    });
  });

  test.each([
    ["a child of a multimodal stop", { ...STOP, isChildOfParent: true }, true],
    ["a multimodal stop", { ...STOP, isParent: true }, true],
    ["an expired stop", { ...STOP, hasExpired: true }, true],
    ["an unsaved stop", { id: "new_123" }, true],
    ["a read-only stop", STOP, false],
  ])("not offered for %s", (_name, stopPlace, canEdit) => {
    renderButton(stopPlace, canEdit);
    expect(screen.queryByRole("button", { name: LABEL })).toBeNull();
  });

  test("not offered when the deployment switches it off", () => {
    config.modalityConfig = { disableMultiModalStopPlaceCreation: true };
    renderButton(STOP);
    expect(screen.queryByRole("button", { name: LABEL })).toBeNull();
  });
});
