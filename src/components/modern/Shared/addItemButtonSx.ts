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

/**
 * Shared styling for every "add new item" button: a white/paper circular button
 * whose icon carries the element's semantic colour, matching the map markers
 * (quays → success.main, parking → info.main, stop places → primary.main).
 *
 * Returns a plain style object rather than SxProps so callers can spread it and
 * override a property — SxProps permits arrays, which are not spreadable.
 */
export const addItemButtonSx = (color: string): SystemStyleObject<Theme> => ({
  bgcolor: "background.paper",
  color,
  boxShadow: 1,
  "&:hover": { bgcolor: "background.paper" },
});
