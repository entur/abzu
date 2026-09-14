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

import { Box } from "@mui/material";

const DOT_SIZE = 6;

/**
 * The bare "unsaved" mark. Extracted so the field label, the header and any
 * future surface render the identical dot from one definition — the whole point
 * being that a single mark means "unsaved" wherever it appears.
 *
 * Rendered as a span with `flexShrink: 0` so it survives beside a name that is
 * being ellipsised.
 */
export const UnsavedDot = () => (
  <Box
    component="span"
    sx={{
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: "50%",
      bgcolor: "warning.main",
      flexShrink: 0,
    }}
  />
);
