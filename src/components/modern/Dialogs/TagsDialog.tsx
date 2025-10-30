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
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { useIntl } from "react-intl";

interface Tag {
  name: string;
  comment?: string;
  createdBy?: string;
  created?: string;
  idReference?: string;
}

export interface TagsDialogProps {
  open: boolean;
  handleClose: () => void;
  tags: Tag[];
  idReference?: string;
  addTag: (idReference: string, name: string, comment: string) => Promise<any>;
  getTags: (idReference: string) => Promise<any>;
  removeTag: (name: string, idReference: string) => Promise<any>;
  findTagByName: (name: string) => Promise<any>;
}

export const TagsDialog: React.FC<TagsDialogProps> = ({
  open,
  handleClose,
  tags,
  idReference,
  addTag,
  getTags,
  removeTag,
  findTagByName,
}) => {
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [tagName, setTagName] = useState("");
  const [comment, setComment] = useState("");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);

  const handleSearchTags = async (searchValue: string) => {
    setSearchText(searchValue);
    setTagName(searchValue);

    if (searchValue.length >= 2) {
      try {
        const result = await findTagByName(searchValue);
        if (result && result.data && result.data.tags) {
          setSuggestions(result.data.tags.slice(0, 5)); // Limit to 5 suggestions
        }
      } catch (error) {
        console.error("Error searching tags:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleChooseTag = (tag: Tag) => {
    setTagName(tag.name);
    setSearchText(tag.name);
    if (tag.comment) {
      setComment(tag.comment);
    }
    setSuggestions([]);
  };

  const handleAddTag = async () => {
    if (!idReference || !tagName) return;

    setIsLoading(true);
    try {
      await addTag(idReference, tagName, comment);
      await getTags(idReference);
      setTagName("");
      setComment("");
      setSearchText("");
      setSuggestions([]);
    } catch (error) {
      console.error("Error adding tag:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = async (name: string) => {
    if (!idReference) return;

    setIsLoading(true);
    try {
      await removeTag(name, idReference);
      await getTags(idReference);
    } catch (error) {
      console.error("Error removing tag:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {formatMessage({ id: "tags" })}
        </Typography>
        {isLoading && <CircularProgress size={24} sx={{ mr: 1 }} />}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {/* List of existing tags */}
          <Box sx={{ mb: 3, maxHeight: 300, overflowY: "auto" }}>
            {tags && tags.length > 0 ? (
              tags.map((tag, i) => (
                <Box
                  key={`tag-${i}`}
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
                      title={
                        tag.comment || formatMessage({ id: "comment_missing" })
                      }
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
                  <Typography
                    variant="caption"
                    sx={{ flex: 1.5, color: "text.secondary" }}
                  >
                    {tag.createdBy || formatMessage({ id: "not_assigned" })}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ flex: 1.5, color: "text.secondary" }}
                  >
                    {tag.created
                      ? moment(tag.created)
                          .locale("nb")
                          .format("DD-MM-YYYY HH:mm")
                      : formatMessage({ id: "not_assigned" })}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteTag(tag.name)}
                    color="error"
                    sx={{ flex: 0 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
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

          {/* Add new tag form */}
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
                  onChange={(e) => handleSearchTags(e.target.value)}
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
                        onClick={() => handleChooseTag(suggestion)}
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
                onChange={(e) => setComment(e.target.value)}
                placeholder={formatMessage({ id: "comment" })}
              />

              {/* Add button */}
              <Button
                variant="contained"
                onClick={handleAddTag}
                disabled={!tagName || isLoading}
                startIcon={<AddIcon />}
                fullWidth
              >
                {formatMessage({ id: "add" })}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
