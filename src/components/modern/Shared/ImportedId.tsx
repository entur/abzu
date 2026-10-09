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
import React from "react";
import { CopyIdButton } from "./CopyIdButton";

export interface ImportedIdProps {
  text: string;
  id?: string | string[];
  showCopyButtons?: boolean;
}

export const ImportedId: React.FC<ImportedIdProps> = ({
  text,
  id = [],
  showCopyButtons = false,
}) => {
  const idArray = (Array.isArray(id) ? id : [id]).filter(Boolean);

  if (idArray.length === 0) return null;

  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" sx={{ fontWeight: 600, display: "block" }}>
        {text}
      </Typography>
      {showCopyButtons ? (
        idArray.map((importedId, i) => (
          <Box
            key={i}
            sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {importedId}
            </Typography>
            <CopyIdButton idToCopy={importedId} size="small" />
          </Box>
        ))
      ) : (
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {idArray.join(", ")}
        </Typography>
      )}
    </Box>
  );
};
