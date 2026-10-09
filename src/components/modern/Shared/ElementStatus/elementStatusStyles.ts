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

import type { Theme } from "@mui/material";
import type { SystemStyleObject } from "@mui/system";
import { ElementChangeStatus } from "./types";

const GHOST_OPACITY = 0.45;

/**
 * Row styling for a staged deletion. `new` and `modified` are marked by the
 * inline dot instead, so they need no row styling at all.
 *
 * Ghost rows render regardless of the affordance setting: a row that has
 * vanished from the list is more confusing than one that is visibly struck out.
 */
export const getElementRowStatusSx = (
  status: ElementChangeStatus,
): SystemStyleObject<Theme> => {
  if (status !== "deleted") return {};

  return {
    opacity: GHOST_OPACITY,
    cursor: "default",
    textDecoration: "line-through",
    bgcolor: "action.disabledBackground",
    "&:hover": { bgcolor: "action.disabledBackground" },
  };
};
