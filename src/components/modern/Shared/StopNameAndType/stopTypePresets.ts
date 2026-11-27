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

import stopTypes from "../../../../models/stopTypes";
import { isStopPlaceTypeValid } from "./stopPlaceTypeRules";

export interface StopTypePreset {
  stopPlaceType: string;
  submode: string | null;
}

/**
 * The stop types people choose from (F-17): one row sets type and submode
 * together, the same list when creating and editing. A draft for the product
 * owner to approve (D3): every base type, plus the submodes a stop place is
 * commonly given. Edit this list to change what the pickers offer.
 */
export const STOP_TYPE_PRESETS: StopTypePreset[] = [
  { stopPlaceType: "onstreetBus", submode: null },
  { stopPlaceType: "onstreetBus", submode: "railReplacementBus" },
  { stopPlaceType: "onstreetBus", submode: "airportLinkBus" },
  { stopPlaceType: "busStation", submode: null },
  { stopPlaceType: "harbourPort", submode: null },
  { stopPlaceType: "harbourPort", submode: "localCarFerry" },
  { stopPlaceType: "harbourPort", submode: "nationalCarFerry" },
  { stopPlaceType: "harbourPort", submode: "internationalCarFerry" },
  { stopPlaceType: "ferryStop", submode: null },
  { stopPlaceType: "ferryStop", submode: "highSpeedPassengerService" },
  { stopPlaceType: "ferryStop", submode: "localPassengerFerry" },
  { stopPlaceType: "ferryStop", submode: "internationalPassengerFerry" },
  { stopPlaceType: "railStation", submode: null },
  { stopPlaceType: "railStation", submode: "touristRailway" },
  { stopPlaceType: "onstreetTram", submode: null },
  { stopPlaceType: "onstreetTram", submode: "cityTram" },
  { stopPlaceType: "metroStation", submode: null },
  { stopPlaceType: "airport", submode: null },
  { stopPlaceType: "airport", submode: "helicopterService" },
  { stopPlaceType: "liftStation", submode: null },
  { stopPlaceType: "funicular", submode: null },
];

export interface StopTypePresetGroup {
  transportMode: string;
  presets: StopTypePreset[];
}

const isSamePreset = (a: StopTypePreset, b: StopTypePreset): boolean =>
  a.stopPlaceType === b.stopPlaceType &&
  (a.submode ?? null) === (b.submode ?? null);

const transportModeOf = (stopPlaceType: string): string =>
  stopTypes[stopPlaceType as keyof typeof stopTypes]?.transportMode ??
  "unknown";

/**
 * The presets the deployment allows, grouped by transport mode in list
 * order. A stop whose current type isn't a preset keeps it as an extra
 * row, first in its group, so editing never hides or changes it.
 */
export const groupStopTypePresets = (
  hiddenStopTypes: string[],
  current: StopTypePreset | null = null,
): StopTypePresetGroup[] => {
  const offered = STOP_TYPE_PRESETS.filter(({ stopPlaceType }) =>
    isStopPlaceTypeValid(stopPlaceType, hiddenStopTypes),
  );
  const keepsCurrent =
    current?.stopPlaceType &&
    !offered.some((preset) => isSamePreset(preset, current));
  const rows = keepsCurrent ? [current, ...offered] : offered;

  return rows.reduce<StopTypePresetGroup[]>((groups, preset) => {
    const transportMode = transportModeOf(preset.stopPlaceType);
    const group = groups.find(
      (existing) => existing.transportMode === transportMode,
    );
    if (group) {
      group.presets.push(preset);
      return groups;
    }
    return [...groups, { transportMode, presets: [preset] }];
  }, []);
};

/** "Busstopp" for a plain type, the submode's name ("Flybuss") otherwise. */
export const presetLabelId = ({
  stopPlaceType,
  submode,
}: StopTypePreset): string =>
  submode
    ? `stopTypes_${stopPlaceType}_submodes_${submode}`
    : `stopTypes_${stopPlaceType}_name`;
