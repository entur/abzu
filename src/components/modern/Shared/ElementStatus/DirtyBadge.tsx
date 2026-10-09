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

import { Badge } from "@mui/material";
import React from "react";

interface DirtyBadgeProps {
  /** Caller folds in the affordance toggle; this component just renders. */
  dirty: boolean;
  children: React.ReactNode;
}

/**
 * Wraps an icon or label with the dirty dot, for surfaces that hide their
 * contents — a tab, a section header, a dialog trigger. Same warning dot the
 * list rows and map markers use, so one mark means "unsaved" everywhere.
 */
export const DirtyBadge = ({ dirty, children }: DirtyBadgeProps) => (
  <Badge
    variant="dot"
    color="warning"
    overlap="circular"
    invisible={!dirty}
    sx={{ "& .MuiBadge-badge": { right: 2, top: 2 } }}
  >
    {children}
  </Badge>
);
