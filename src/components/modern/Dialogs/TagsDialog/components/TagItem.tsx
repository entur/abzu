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

import DeleteIcon from "@mui/icons-material/DeleteForever";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { TagChip } from "../../../Shared/TagChip";
import { Tag } from "../hooks/useTagsDialog";

interface TagItemProps {
  tag: Tag;
  onDelete: (name: string) => void;
}

/**
 * One tag (F-59): the tag and its comment, the part people read, come first
 * in body text. Who added it and when is a small line underneath, with the
 * date in the UI's language. The chip is the shared TagChip.
 */
export const TagItem: React.FC<TagItemProps> = ({ tag, onDelete }) => {
  const { formatMessage, formatDate } = useIntl();
  const { name, comment, createdBy, created } = tag;
  const addedBy = createdBy || formatMessage({ id: "not_assigned" });
  const addedAt = created
    ? formatDate(created, { dateStyle: "short", timeStyle: "short" })
    : formatMessage({ id: "not_assigned" });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <TagChip name={name} sx={{ flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {comment && (
          <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
            {comment}
          </Typography>
        )}
        <Typography
          variant="caption"
          sx={{ display: "block", color: "text.secondary" }}
        >
          {formatMessage({ id: "tag_added_by" }, { name: addedBy })} · {addedAt}
        </Typography>
      </Box>
      <IconButton
        aria-label={formatMessage({ id: "remove_tag" }, { name })}
        size="small"
        onClick={() => onDelete(name)}
        color="error"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
