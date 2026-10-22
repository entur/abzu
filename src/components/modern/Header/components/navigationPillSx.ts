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

import { alpha, Theme } from "@mui/material";
import type { SystemStyleObject } from "@mui/system";
import { NAVIGATION_LINE_HEIGHT } from "../headerMetrics";

const INACTIVE_PILL_OPACITY = 0.7;
const HOVERED_PILL_OPACITY = 0.08;

/* Insets the pill from the top and bottom of the line, so the highlight can
   never touch the edge the editor panel is docked against. */
const PILL_INSET = 4;

/**
 * An unselected pill in the navigation line: the Map/Reports tabs and the UI
 * switch beside them share it, so the row reads as one control strip.
 */
export const navigationPillSx: SystemStyleObject<Theme> = {
  minHeight: NAVIGATION_LINE_HEIGHT - PILL_INSET * 2,
  my: `${PILL_INSET}px`,
  minWidth: 0,
  px: 2,
  borderRadius: 1,
  textTransform: "none",
  color: (theme) =>
    alpha(theme.palette.primary.contrastText, INACTIVE_PILL_OPACITY),
  "&:hover": {
    backgroundColor: (theme) =>
      alpha(theme.palette.primary.contrastText, HOVERED_PILL_OPACITY),
  },
};
