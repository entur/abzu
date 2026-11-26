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
/** The filled dot inside an active radio indicator. */
const RADIO_DOT_SIZE = 10;

interface SettingIndicatorProps {
  checked: boolean;
  /** "radio" for a single choice among several (e.g. the base map, F-27). */
  variant?: "checkbox" | "radio";
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
 *
 * The radio variant is round with a dot, for a list where only one row can be
 * on; it keeps the same footprint and colours.
 */
export const SettingIndicator = ({
  checked,
  variant = "checkbox",
}: SettingIndicatorProps) => {
  const isRadio = variant === "radio";
  return (
    <Box
      data-variant={variant}
      sx={{
        width: INDICATOR_SIZE,
        height: INDICATOR_SIZE,
        border: `${INDICATOR_BORDER_WIDTH}px solid`,
        borderColor: checked ? "primary.main" : "action.active",
        borderRadius: isRadio ? "50%" : 0.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {checked && isRadio && (
        <Box
          data-testid="radio-dot"
          sx={{
            width: RADIO_DOT_SIZE,
            height: RADIO_DOT_SIZE,
            borderRadius: "50%",
            bgcolor: "primary.main",
          }}
        />
      )}
      {checked && !isRadio && (
        <Check color="primary" sx={{ fontSize: CHECK_ICON_SIZE }} />
      )}
    </Box>
  );
};
