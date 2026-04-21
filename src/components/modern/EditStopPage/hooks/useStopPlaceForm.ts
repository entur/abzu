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

import { useCallback } from "react";
import { StopPlaceActions } from "../../../../actions";
import {
  addTag,
  findTagByName,
  getTags,
  removeTag,
} from "../../../../actions/TiamatActions";
import stopTypes from "../../../../models/stopTypes";
import { useAppDispatch } from "../../../../store/hooks";

interface UseStopPlaceFormReturn {
  handleNameChange: (value: string) => void;
  handleDescriptionChange: (value: string) => void;
  handleTypeChange: (type: string) => void;
  handleSubmodeChange: (stopPlaceType: string, submode: string) => void;
  handleWeightingChange: (value: string) => void;
  handleAddTag: (
    idReference: string,
    name: string,
    comment: string,
  ) => Promise<unknown>;
  handleGetTags: (idReference: string) => Promise<unknown>;
  handleRemoveTag: (name: string, idReference: string) => Promise<unknown>;
  handleFindTagByName: (name: string) => Promise<unknown>;
}

/**
 * Hook for managing stop place general field changes and tags
 */
export const useStopPlaceForm = (): UseStopPlaceFormReturn => {
  const dispatch = useAppDispatch();

  const handleNameChange = useCallback(
    (value: string) => {
      dispatch(StopPlaceActions.changeStopName(value));
    },
    [dispatch],
  );

  const handleDescriptionChange = useCallback(
    (value: string) => {
      dispatch(StopPlaceActions.changeStopDescription(value));
    },
    [dispatch],
  );

  const handleTypeChange = useCallback(
    (type: string) => {
      dispatch(StopPlaceActions.changeStopType(type));
    },
    [dispatch],
  );

  const handleSubmodeChange = useCallback(
    (stopPlaceType: string, submode: string) => {
      const transportMode =
        stopTypes[stopPlaceType as keyof typeof stopTypes]?.transportMode ?? "";
      dispatch(
        StopPlaceActions.changeSubmode(stopPlaceType, transportMode, submode),
      );
    },
    [dispatch],
  );

  const handleWeightingChange = useCallback(
    (value: string) => {
      dispatch(StopPlaceActions.changeWeightingForStop(value));
    },
    [dispatch],
  );

  const handleAddTag = useCallback(
    (idReference: string, name: string, comment: string) => {
      return dispatch(addTag(idReference, name, comment));
    },
    [dispatch],
  );

  const handleGetTags = useCallback(
    (idReference: string) => {
      return dispatch(getTags(idReference));
    },
    [dispatch],
  );

  const handleRemoveTag = useCallback(
    (name: string, idReference: string) => {
      return dispatch(removeTag(name, idReference));
    },
    [dispatch],
  );

  const handleFindTagByName = useCallback(
    (name: string) => {
      return dispatch(findTagByName(name));
    },
    [dispatch],
  );

  return {
    handleNameChange,
    handleDescriptionChange,
    handleTypeChange,
    handleSubmodeChange,
    handleWeightingChange,
    handleAddTag,
    handleGetTags,
    handleRemoveTag,
    handleFindTagByName,
  };
};
