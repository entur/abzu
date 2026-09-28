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

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { useResponsive } from "../../../theme/hooks";

interface PanelToggleIconProps {
  /** True when the panel is currently open. */
  isExpanded: boolean;
}

/**
 * The single definition of the editor panel's expand/collapse arrow.
 *
 * **The arrow points where the panel is about to move**, and the panel moves in
 * opposite directions on the two layouts:
 *
 * - desktop — the panel hangs from the top, so it collapses *upward*
 * - mobile — the panel is a bottom sheet, so it collapses *downward*
 *
 * Which means mobile inverts. `MinimizedBarHeader` already did this; the three
 * entity headers did not, so on a phone their arrow pointed away from the
 * direction the sheet actually travelled.
 *
 * Defined once because the same ternary had been written out in four files —
 * the `SettingIndicator` problem, where fixing one leaves three unchanged.
 * Reads the breakpoint itself so the three entity headers don't have to learn
 * about layout to render an arrow.
 */
export const PanelToggleIcon: React.FC<PanelToggleIconProps> = ({
  isExpanded,
}) => {
  const { isMobile } = useResponsive();
  const pointsUp = isMobile ? !isExpanded : isExpanded;

  return pointsUp ? (
    <ExpandLessIcon fontSize="small" />
  ) : (
    <ExpandMoreIcon fontSize="small" />
  );
};
