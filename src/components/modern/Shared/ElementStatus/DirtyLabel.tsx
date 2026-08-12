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
import React from "react";

const DOT_SIZE = 6;

interface DirtyLabelProps {
  /** Caller folds in the affordance toggle; this component just renders. */
  dirty: boolean;
  children: React.ReactNode;
}

/**
 * A field label with the dirty dot appended, for inputs whose value is visible
 * but whose *changed* state is not. Rendered as a span so it can be passed as a
 * TextField / InputLabel `label`, where a Badge would clash with the floating
 * label animation.
 */
export const DirtyLabel = ({ dirty, children }: DirtyLabelProps) => (
  <Box
    component="span"
    sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
  >
    {children}
    {dirty && (
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
    )}
  </Box>
);
