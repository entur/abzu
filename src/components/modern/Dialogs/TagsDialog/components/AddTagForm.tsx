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

import AddIcon from "@mui/icons-material/Add";
import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { Tag } from "../hooks/useTagsDialog";

interface AddTagFormProps {
  searchText: string;
  comment: string;
  suggestions: Tag[];
  tagName: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onChooseTag: (tag: Tag) => void;
  onAddTag: () => void;
}

/**
 * Form to add a new tag
 * Includes search input with suggestions, comment field, and add button
 */
export const AddTagForm: React.FC<AddTagFormProps> = ({
  searchText,
  comment,
  suggestions,
  tagName,
  isLoading,
  onSearchChange,
  onCommentChange,
  onChooseTag,
  onAddTag,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        pt: 2,
        borderTop: "2px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        {formatMessage({ id: "add" })} {formatMessage({ id: "tags" })}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Tag name input with autocomplete */}
        <Box sx={{ position: "relative" }}>
          <TextField
            label={formatMessage({ id: "tags" })}
            fullWidth
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={formatMessage({
              id: "search_for_existing_tags",
            })}
          />
          {suggestions.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                mt: 0.5,
                maxHeight: 200,
                overflowY: "auto",
                zIndex: 1,
                boxShadow: 2,
              }}
            >
              {suggestions.map((suggestion, idx) => (
                <Box
                  key={`suggestion-${idx}`}
                  onClick={() => onChooseTag(suggestion)}
                  sx={{
                    p: 1.5,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    borderBottom:
                      idx < suggestions.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {suggestion.name}
                  </Typography>
                  {suggestion.comment && (
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {suggestion.comment}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Comment input */}
        <TextField
          label={formatMessage({ id: "comment" })}
          fullWidth
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder={formatMessage({ id: "comment" })}
        />

        {/* Add button */}
        <Button
          variant="contained"
          onClick={onAddTag}
          disabled={!tagName || isLoading}
          startIcon={<AddIcon />}
          fullWidth
        >
          {formatMessage({ id: "add" })}
        </Button>
      </Box>
    </Box>
  );
};
