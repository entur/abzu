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

import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";

interface TagRemovedRowProps {
  name: string;
  onUndo: () => void;
}

/** Stands in for a removed tag while the removal can still be undone (F-59). */
export const TagRemovedRow: React.FC<TagRemovedRowProps> = ({
  name,
  onUndo,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      role="status"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" sx={{ flex: 1 }}>
        {formatMessage({ id: "tag_removed" }, { name })}
      </Typography>
      <Button size="small" variant="outlined" onClick={onUndo}>
        {formatMessage({ id: "undo" })}
      </Button>
    </Box>
  );
};
