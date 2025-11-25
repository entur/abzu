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

import { useCallback, useState } from "react";

export interface Tag {
  name: string;
  comment?: string;
  createdBy?: string;
  created?: string;
  idReference?: string;
}

interface UseTagsDialogProps {
  idReference?: string;
  addTag: (idReference: string, name: string, comment: string) => Promise<any>;
  getTags: (idReference: string) => Promise<any>;
  removeTag: (name: string, idReference: string) => Promise<any>;
  findTagByName: (name: string) => Promise<any>;
}

export const useTagsDialog = ({
  idReference,
  addTag,
  getTags,
  removeTag,
  findTagByName,
}: UseTagsDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tagName, setTagName] = useState("");
  const [comment, setComment] = useState("");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);

  const handleSearchTags = useCallback(
    async (searchValue: string) => {
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
    },
    [findTagByName],
  );

  const handleChooseTag = useCallback((tag: Tag) => {
    setTagName(tag.name);
    setSearchText(tag.name);
    if (tag.comment) {
      setComment(tag.comment);
    }
    setSuggestions([]);
  }, []);

  const handleAddTag = useCallback(async () => {
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
  }, [idReference, tagName, comment, addTag, getTags]);

  const handleDeleteTag = useCallback(
    async (name: string) => {
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
    },
    [idReference, removeTag, getTags],
  );

  return {
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
  };
};
