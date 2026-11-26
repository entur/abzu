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
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { describe, expect, test, vi } from "vitest";
import enMessages from "../static/lang/en.json";

vi.mock("../components/modern/Shared/useNavigateToStopPlace", () => ({
  useNavigateToStopPlace: () => ({
    loading: false,
    loadingName: "",
    navigateTo: vi.fn(),
  }),
}));

const { StopPlaceListItem } =
  await import("../components/modern/GroupOfStopPlaces/components/StopPlaceListItem");

const member = {
  id: "NSR:StopPlace:58052",
  name: "Bergen Nøstet kystrutekai",
  stopPlaceType: "harbourPort",
};

const renderItem = (hasExpired: boolean) =>
  render(
    <IntlProvider locale="en" messages={enMessages}>
      <StopPlaceListItem stopPlace={{ ...member, hasExpired }} />
    </IntlProvider>,
  );

describe("StopPlaceListItem", () => {
  test("marks an expired member", () => {
    renderItem(true);
    expect(screen.getByText(enMessages.has_expired)).toBeInTheDocument();
  });

  test("shows no mark on an active member", () => {
    renderItem(false);
    expect(screen.queryByText(enMessages.has_expired)).not.toBeInTheDocument();
  });
});
