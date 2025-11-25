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

import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { Tag } from "../hooks/useTagsDialog";

interface TagItemProps {
  tag: Tag;
  onDelete: (name: string) => void;
}

/**
 * Individual tag item display
 * Shows tag name, comment, created by, date, and delete button
 */
export const TagItem: React.FC<TagItemProps> = ({ tag, onDelete }) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        gap: 2,
      }}
    >
      <Box sx={{ flex: 2 }}>
        <Tooltip
          title={tag.comment || formatMessage({ id: "comment_missing" })}
        >
          <Chip
            label={tag.name}
            size="small"
            sx={{
              bgcolor: "warning.main",
              color: "white",
              fontWeight: 500,
            }}
          />
        </Tooltip>
        {tag.comment && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              color: "text.secondary",
            }}
          >
            {tag.comment}
          </Typography>
        )}
      </Box>
      <Typography variant="caption" sx={{ flex: 1.5, color: "text.secondary" }}>
        {tag.createdBy || formatMessage({ id: "not_assigned" })}
      </Typography>
      <Typography variant="caption" sx={{ flex: 1.5, color: "text.secondary" }}>
        {tag.created
          ? moment(tag.created).locale("nb").format("DD-MM-YYYY HH:mm")
          : formatMessage({ id: "not_assigned" })}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onDelete(tag.name)}
        color="error"
        sx={{ flex: 0 }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
