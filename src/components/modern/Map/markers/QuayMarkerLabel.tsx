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

import { Typography } from "@mui/material";
import { fitQuayLabel } from "./utils/quayLabelFit";

interface QuayMarkerLabelProps {
  label: string;
  /** Font size for a short code, in rem, before zoom scaling. */
  baseFontRem: number;
  scale: number;
  color: string;
}

/** A quay code that stays inside its circle, however long it is (F-100). */
export const QuayMarkerLabel = ({
  label,
  baseFontRem,
  scale,
  color,
}: QuayMarkerLabelProps) => {
  const { text, fontScale } = fitQuayLabel(label);

  return (
    <Typography
      sx={{
        color,
        fontWeight: 800,
        fontSize: `${baseFontRem * fontScale * scale}rem`,
        lineHeight: 1,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
    >
      {text}
    </Typography>
  );
};
