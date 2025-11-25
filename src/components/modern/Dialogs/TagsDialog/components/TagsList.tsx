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
import { useIntl } from "react-intl";
import { Tag } from "../hooks/useTagsDialog";
import { TagItem } from "./TagItem";

interface TagsListProps {
  tags: Tag[];
  onDeleteTag: (name: string) => void;
}

/**
 * List container for existing tags
 * Shows all tags or empty state message
 */
export const TagsList: React.FC<TagsListProps> = ({ tags, onDeleteTag }) => {
  const { formatMessage } = useIntl();

  return (
    <Box sx={{ mb: 3, maxHeight: 300, overflowY: "auto" }}>
      {tags && tags.length > 0 ? (
        tags.map((tag, i) => (
          <TagItem key={`tag-${i}`} tag={tag} onDelete={onDeleteTag} />
        ))
      ) : (
        <Typography
          variant="body2"
          sx={{ textAlign: "center", py: 3, color: "text.secondary" }}
        >
          {formatMessage({ id: "no_tags" })}
        </Typography>
      )}
    </Box>
  );
};
