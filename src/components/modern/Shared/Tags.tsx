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

import { Chip, Stack, Tooltip } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";

interface Tag {
  name: string;
  comment?: string;
}

interface TagsProps {
  tags?: Tag[] | string[];
}

/**
 * Modern replacement for TagTray component
 * Displays tags as orange chips with tooltips
 * Supports both Tag objects and simple strings
 */
export const Tags: React.FC<TagsProps> = ({ tags }) => {
  const { formatMessage } = useIntl();

  if (!tags || tags.length === 0) return null;

  return (
    <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", mb: 1 }}>
      {tags.map((tag, index) => {
        // Handle both string and Tag object formats
        const tagName = typeof tag === "string" ? tag : tag.name;
        const tagComment =
          typeof tag === "string"
            ? ""
            : tag.comment || formatMessage({ id: "comment_missing" });

        if (!tagName) return null;

        return (
          <Tooltip key={`tag-${index}`} title={tagComment || tagName} arrow>
            <Chip
              label={tagName.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: "warning.main",
                color: "white",
                fontWeight: 500,
                fontSize: "0.7rem",
                height: 22,
                mb: 0.5,
                "&:hover": {
                  backgroundColor: "warning.dark",
                },
              }}
            />
          </Tooltip>
        );
      })}
    </Stack>
  );
};
