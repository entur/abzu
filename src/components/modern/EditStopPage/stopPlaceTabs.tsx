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

import AccessibleIcon from "@mui/icons-material/Accessible";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import React from "react";
import BusShelter from "../../../static/icons/facilities/BusShelter";
import {
  ACCESSIBILITY_TAB_KEYS,
  ASSISTANCE_TAB_KEYS,
  FACILITIES_TAB_KEYS,
  KEY_VALUES_TAB_KEYS,
} from "../Shared/ElementStatus";

const BUS_SHELTER_FONT_SIZE = "1.25rem";

export interface StopPlaceTabDefinition {
  /** Tab index in the expanded panel — also what a collapsed shortcut targets. */
  index: number;
  id: string;
  labelId: string;
  renderIcon: () => React.ReactElement;
  /** Keys this tab owns. Undefined means the General catch-all. */
  dirtyKeys?: readonly string[];
}

/**
 * The single definition of the editor's tabs.
 *
 * Both the expanded panel's tab strip and the collapsed bar's shortcuts are
 * generated from this list, so a shortcut cannot drift away from the tab it
 * opens — the collapsed bar is literally the same list, rendered smaller.
 */
export const STOP_PLACE_TABS: readonly StopPlaceTabDefinition[] = [
  {
    index: 0,
    id: "general",
    labelId: "stopPlace",
    renderIcon: () => <InfoOutlinedIcon fontSize="small" />,
  },
  {
    index: 1,
    id: "accessibility",
    labelId: "accessibility",
    renderIcon: () => <AccessibleIcon fontSize="small" />,
    dirtyKeys: ACCESSIBILITY_TAB_KEYS,
  },
  {
    index: 2,
    id: "facilities",
    labelId: "facilities",
    renderIcon: () => <BusShelter sx={{ fontSize: BUS_SHELTER_FONT_SIZE }} />,
    dirtyKeys: FACILITIES_TAB_KEYS,
  },
  {
    index: 3,
    id: "assistance",
    labelId: "assistance",
    renderIcon: () => <SupportAgentIcon fontSize="small" />,
    dirtyKeys: ASSISTANCE_TAB_KEYS,
  },
  {
    index: 4,
    id: "keyValues",
    labelId: "key_values_hint",
    renderIcon: () => <VpnKeyIcon fontSize="small" />,
    dirtyKeys: KEY_VALUES_TAB_KEYS,
  },
];

/** Tab shown when the panel is expanded without a specific target. */
export const DEFAULT_STOP_PLACE_TAB = 0;
