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
import enMessages from "../static/lang/en.json";

vi.mock("../store/hooks", () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: (state: object) => unknown) =>
    selector({ stopPlacesGroup: { current: null } }),
}));
vi.mock("../config/ConfigContext", () => ({
  useConfig: () => ({ modalityConfig: {} }),
}));
vi.mock("../components/modern/Map/hooks/useCanEditOnMap", () => ({
  useCanEditOnMap: () => true,
}));
vi.mock("../components/modern/Map/hooks/useIsEditingGroup", () => ({
  useIsEditingGroup: () => false,
}));

const { StopPlacePopup } =
  await import("../components/modern/Map/markers/StopPlacePopup");

const SJOSTRAND_SKOLE = {
  id: "NSR:StopPlace:24869",
  name: "Sjøstrand skole",
  stopPlaceType: "onstreetBus",
};

describe("StopPlacePopup (F-82)", () => {
  test("each create action shows the icon of what it creates", () => {
    render(
      <IntlProvider locale="en" messages={enMessages}>
        <StopPlacePopup
          anchorEl={document.body}
          onClose={vi.fn()}
          stopPlace={SJOSTRAND_SKOLE}
          lat={58.100494}
          lng={7.976486}
        />
      </IntlProvider>,
    );

    const createGroup = screen.getByRole("button", {
      name: enMessages.create_group_of_stop_places,
    });
    const createMultimodal = screen.getByRole("button", {
      name: enMessages.new__multi_stop,
    });
    expect(
      createGroup.querySelector("[data-testid=GroupWorkIcon]"),
    ).toBeInTheDocument();
    expect(
      createMultimodal.querySelector("[data-testid=AccountTreeIcon]"),
    ).toBeInTheDocument();
  });
});

const renderPopup = (
  stopPlace: typeof SJOSTRAND_SKOLE & { hasExpired?: boolean },
  onAdjustCentroid?: () => void,
) =>
  render(
    <IntlProvider locale="en" messages={enMessages}>
      <StopPlacePopup
        anchorEl={document.body}
        onClose={vi.fn()}
        stopPlace={stopPlace}
        lat={58.100494}
        lng={7.976486}
        onAdjustCentroid={onAdjustCentroid}
      />
    </IntlProvider>,
  );

describe("StopPlacePopup Auto-adjust centroid (F-30)", () => {
  const centroidButton = () =>
    screen.queryByRole("button", { name: enMessages.adjust_centroid });

  test("an ordinary stop offers it, and it moves the stop", () => {
    const onAdjustCentroid = vi.fn();
    renderPopup(SJOSTRAND_SKOLE, onAdjustCentroid);
    fireEvent.click(centroidButton()!);
    expect(onAdjustCentroid).toHaveBeenCalledTimes(1);
  });

  test("hidden when there is nothing to centre on", () => {
    renderPopup(SJOSTRAND_SKOLE);
    expect(centroidButton()).not.toBeInTheDocument();
  });

  test("hidden on an expired stop", () => {
    renderPopup({ ...SJOSTRAND_SKOLE, hasExpired: true }, vi.fn());
    expect(centroidButton()).not.toBeInTheDocument();
  });
});
