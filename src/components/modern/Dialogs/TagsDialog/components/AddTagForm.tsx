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
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { Tag } from "../hooks/useTagsDialog";

interface AddTagFormProps {
  searchText: string;
  comment: string;
  suggestions: Tag[];
  tagName: string;
  isLoading: boolean;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onChooseTag: (tag: Tag) => void;
  onAddTag: () => void;
}

/** Tiamat already filters by name; the list is shown as it comes. */
const keepServerOrder = (options: Tag[]): Tag[] => options;

const labelOf = (option: Tag | string): string =>
  typeof option === "string" ? option : option.name;

/**
 * Form to add a tag: a tag-name field that suggests existing tags, a comment
 * field and the add button. A new name can be typed freely. The suggestions
 * open in a popup above the dialog, so nothing shows through them and they
 * aren't clipped by the dialog, and ↑/↓/Enter pick one (F-58).
 */
export const AddTagForm: React.FC<AddTagFormProps> = ({
  searchText,
  comment,
  suggestions,
  tagName,
  isLoading,
  isSearching,
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
        <Autocomplete<Tag, false, false, true>
          freeSolo
          options={suggestions}
          value={null}
          inputValue={searchText}
          loading={isSearching}
          loadingText={formatMessage({ id: "loading" })}
          filterOptions={keepServerOrder}
          getOptionLabel={labelOf}
          onInputChange={(_event, value, reason) => {
            if (reason === "input" || reason === "clear") onSearchChange(value);
          }}
          onChange={(_event, value) => {
            if (value && typeof value !== "string") onChooseTag(value);
          }}
          renderOption={({ key, ...optionProps }, option) => (
            <Box component="li" key={key} {...optionProps}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {option.name}
                </Typography>
                {option.comment && (
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {option.comment}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={formatMessage({ id: "tags" })}
              placeholder={formatMessage({ id: "search_for_existing_tags" })}
            />
          )}
        />

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
