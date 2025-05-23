import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import ModalitiesMenuItems from "../components/EditStopPage/ModalitiesMenuItems";
import enMessages from "../static/lang/en.json";

// Mock ModalityIconSvg to inspect props
vi.mock("../components/MainPage/ModalityIconSvg", () => ({
  default: vi.fn(({ type, submode }) => (
    <div
      data-testid="modality-icon-svg"
      data-type={type}
      data-submode={submode || ""}
    >
      MockModalityIconSvg
    </div>
  )),
}));

// Base mocks
const mockStopTypesBase = {
  onstreetBus: { transportMode: "bus", submodes: ["localBus", "expressBus"] },
  railStation: { transportMode: "rail", submodes: ["local", "regionalRail"] },
};

const mockAllowsInfoBase = {
  legalStopPlaceTypes: ["onstreetBus", "railStation"],
  legalSubmodes: ["localBus", "expressBus", "local", "regionalRail"],
  blacklistedStopPlaceTypes: [],
};

const renderWithIntl = (
  ui,
  { locale = "en", messages = enMessages, ...options } = {},
) =>
  render(
    <IntlProvider locale={locale} messages={messages}>
      {ui}
    </IntlProvider>,
    options,
  );

describe("ModalitiesMenuItems Component", () => {
  let consoleWarnSpy;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    vi.clearAllMocks();
  });

  test('renders "other" StopPlaceType correctly when selected', () => {
    const mockStopTypes = {
      ...mockStopTypesBase,
      other: { transportMode: "unknown", submodes: [] },
    };
    const mockAllows = {
      ...mockAllowsInfoBase,
      legalStopPlaceTypes: [...mockAllowsInfoBase.legalStopPlaceTypes, "other"],
    };
    const onTypeChange = vi.fn();
    const onSubmodeChange = vi.fn();

    renderWithIntl(
      <ModalitiesMenuItems
        stopTypes={mockStopTypes}
        allowsInfo={mockAllows}
        handleStopTypeChange={onTypeChange}
        handleSubModeTypeChange={onSubmodeChange}
        stopPlaceTypeChosen="other"
        submodeChosen={null}
      />,
    );

    const label = screen.getByText(enMessages["stopTypes_other_name"]);
    expect(label).toBeInTheDocument();
  });

  test('includes "other" in menu when allowed but not selected', () => {
    const mockStopTypes = {
      ...mockStopTypesBase,
      other: { transportMode: "unknown", submodes: [] },
    };
    const mockAllows = {
      ...mockAllowsInfoBase,
      legalStopPlaceTypes: [...mockAllowsInfoBase.legalStopPlaceTypes, "other"],
    };
    const onTypeChange = vi.fn();
    const onSubmodeChange = vi.fn();

    renderWithIntl(
      <ModalitiesMenuItems
        stopTypes={mockStopTypes}
        allowsInfo={mockAllows}
        handleStopTypeChange={onTypeChange}
        handleSubModeTypeChange={onSubmodeChange}
        stopPlaceTypeChosen="onstreetBus"
        submodeChosen={null}
      />,
    );

    expect(
      screen.getByText(enMessages["stopTypes_other_name"]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(enMessages["stopTypes_onstreetBus_name"]),
    ).toBeInTheDocument();
  });

  test("gracefully handles null stopType entries and warns", () => {
    const mockStopTypes = {
      ...mockStopTypesBase,
      other: null,
      railStation: { transportMode: "rail", submodes: [], name: "Boat Stop" },
    };
    const mockAllows = {
      ...mockAllowsInfoBase,
      legalStopPlaceTypes: [
        ...mockAllowsInfoBase.legalStopPlaceTypes,
        "other",
        "bus",
      ],
    };
    const onTypeChange = vi.fn();
    const onSubmodeChange = vi.fn();

    renderWithIntl(
      <ModalitiesMenuItems
        stopTypes={mockStopTypes}
        allowsInfo={mockAllows}
        handleStopTypeChange={onTypeChange}
        handleSubModeTypeChange={onSubmodeChange}
        stopPlaceTypeChosen="onstreetBus"
        submodeChosen={null}
      />,
    );

    expect(
      screen.getByText(enMessages["stopTypes_onstreetBus_name"]),
    ).toBeInTheDocument();
    expect(screen.queryByText(enMessages["stopTypes_other_name"])).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalled();
  });
});
