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

import { SxProps, Theme } from "@mui/material";

export const generalSectionStyles: Record<string, SxProps<Theme>> = {
  container: {
    px: 2,
    py: 1.5,
  },
  fieldRow: {
    mb: 1.5,
  },
  sectionLabel: {
    fontWeight: 600,
    mb: 0.5,
    color: "text.secondary",
    textTransform: "uppercase",
    fontSize: "0.7rem",
    letterSpacing: "0.08em",
  },
  tagRow: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    flexWrap: "wrap",
    mb: 1,
  },
};
