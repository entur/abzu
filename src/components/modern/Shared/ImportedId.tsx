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

import { Box, Typography } from "@mui/material";

export interface ImportedIdProps {
  text: string;
  id?: string | string[];
}

export const ImportedId: React.FC<ImportedIdProps> = ({ text, id = [] }) => {
  const idArray = Array.isArray(id) ? id : [id];
  const displayText = idArray.join(", ");

  if (!displayText) return null;

  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" sx={{ fontWeight: 600, display: "block" }}>
        {text}
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {displayText}
      </Typography>
    </Box>
  );
};
