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

import { Box, Chip, Tooltip } from "@mui/material";
import { useIntl } from "react-intl";

export interface TagTrayProps {
  tags: string[] | Array<{ name: string; comment?: string }>;
}

export const TagTray: React.FC<TagTrayProps> = ({ tags }) => {
  const { formatMessage } = useIntl();

  if (!tags || tags.length === 0) return null;

  // Normalize tags to objects
  const normalizedTags = tags.map((tag) =>
    typeof tag === "string" ? { name: tag } : tag,
  );

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {normalizedTags.map((tag, index) => {
        const comment = tag.comment || formatMessage({ id: "comment_missing" });

        return (
          <Tooltip key={`tag-${index}`} title={comment} arrow>
            <Chip
              label={tag.name}
              size="small"
              sx={{
                bgcolor: "warning.main",
                color: "white",
                textTransform: "uppercase",
                fontSize: "0.7rem",
                height: "22px",
              }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
};
