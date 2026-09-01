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

import { Check } from "@mui/icons-material";
import { Box } from "@mui/material";

const INDICATOR_SIZE = 20;
const INDICATOR_BORDER_WIDTH = 1.5;
const CHECK_ICON_SIZE = 16;

interface SettingIndicatorProps {
  checked: boolean;
}

/**
 * The on/off mark for a settings row.
 *
 * The box is drawn in **both** states, with the tick inside it when on — the two
 * states then read as one control rather than as two unrelated marks, and the row
 * never shifts because the footprint is identical either way. The border carries
 * the state as well as the tick.
 *
 * The unchecked state used to be an empty `Box`: a 20px spacer holding the layout
 * open with nothing inside it, so there was no control to see at all.
 *
 * Defined once because the same ternary was copied across eight settings rows in
 * four files; fixing one of them left the other seven looking unchanged.
 */
export const SettingIndicator = ({ checked }: SettingIndicatorProps) => (
  <Box
    sx={{
      width: INDICATOR_SIZE,
      height: INDICATOR_SIZE,
      border: `${INDICATOR_BORDER_WIDTH}px solid`,
      borderColor: checked ? "primary.main" : "action.active",
      borderRadius: 0.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {checked && <Check color="primary" sx={{ fontSize: CHECK_ICON_SIZE }} />}
  </Box>
);
