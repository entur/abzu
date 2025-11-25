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

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { AddTagForm, TagsList } from "./TagsDialog/components";
import { Tag, useTagsDialog } from "./TagsDialog/hooks/useTagsDialog";

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

/**
 * Tags Dialog component
 * Refactored into focused components for better maintainability
 * Displays list of tags and form to add new tags
 */
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

  const {
    isLoading,
    tagName,
    comment,
    searchText,
    suggestions,
    setComment,
    handleSearchTags,
    handleChooseTag,
    handleAddTag,
    handleDeleteTag,
  } = useTagsDialog({
    idReference,
    addTag,
    getTags,
    removeTag,
    findTagByName,
  });

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
          <TagsList tags={tags} onDeleteTag={handleDeleteTag} />
          <AddTagForm
            searchText={searchText}
            comment={comment}
            suggestions={suggestions}
            tagName={tagName}
            isLoading={isLoading}
            onSearchChange={handleSearchTags}
            onCommentChange={setComment}
            onChooseTag={handleChooseTag}
            onAddTag={handleAddTag}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
