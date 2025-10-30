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
import { useSelector } from "react-redux";
import { StopPlaceActions, UserActions } from "../../../../actions";
import {
  addTag,
  addToMultiModalStopPlace,
  createParentStopPlace,
  deleteStopPlace,
  findTagByName,
  getNeighbourStops,
  getStopPlaceVersions,
  getTags,
  removeStopPlaceFromMultiModalStop,
  removeTag,
  saveParentStopPlace,
  terminateStop,
} from "../../../../actions/TiamatActions";
import mapToMutationVariables from "../../../../modelUtils/mapToQueryVariables";
import { useAppDispatch } from "../../../../store/hooks";
import { getStopPermissions } from "../../../../utils/permissionsUtils";
import { RootState, UseEditParentStopPlaceReturn } from "../types";

export const useEditParentStopPlace = (): UseEditParentStopPlaceReturn => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const stopPlace = useSelector((state: RootState) => state.stopPlace.current);
  const originalStopPlace = useSelector(
    (state: RootState) => state.stopPlace.originalCurrent,
  );
  const isModified = useSelector(
    (state: RootState) => state.stopPlace.stopHasBeenModified,
  );
  const versions = useSelector((state: RootState) => state.stopPlace.versions);
  const isLoading = useSelector((state: RootState) => state.stopPlace.loading);
  const activeMap = useSelector((state: RootState) => state.mapUtils.activeMap);

  const permissions = getStopPermissions(stopPlace) as any;
  const canEdit = permissions.canEdit;
  const canDelete = permissions.canDelete || permissions.canDeleteStop || false;

  // Dialog states
  const [confirmSaveDialogOpen, setConfirmSaveDialogOpen] = useState(false);
  const [confirmGoBackOpen, setConfirmGoBackOpen] = useState(false);
  const [confirmUndoOpen, setConfirmUndoOpen] = useState(false);
  const [terminateStopDialogOpen, setTerminateStopDialogOpen] = useState(false);
  const [removeChildDialogOpen, setRemoveChildDialogOpen] = useState(false);
  const [addChildDialogOpen, setAddChildDialogOpen] = useState(false);
  const [addAdjacentDialogOpen, setAddAdjacentDialogOpen] = useState(false);
  const [altNamesDialogOpen, setAltNamesDialogOpen] = useState(false);
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [coordinatesDialogOpen, setCoordinatesDialogOpen] = useState(false);
  const [removingChildId, setRemovingChildId] = useState("");

  // Save handlers
  const handleOpenSaveDialog = useCallback(() => {
    setConfirmSaveDialogOpen(true);
  }, []);

  const handleCloseSaveDialog = useCallback(() => {
    setConfirmSaveDialogOpen(false);
  }, []);

  const handleSave = useCallback(
    (userInput: any) => {
      if (!stopPlace) return;

      setConfirmSaveDialogOpen(false);

      if (stopPlace.isNewStop) {
        const variables = mapToMutationVariables.mapParentStopToVariables(
          stopPlace as any,
          userInput,
        );
        dispatch(createParentStopPlace(variables as any)).then(({ data }) => {
          if (data && data.createMultiModalStopPlace) {
            const id = data.createMultiModalStopPlace.id;
            dispatch(UserActions.navigateTo(`/stop_place/`, id));
          }
        });
      } else {
        const childrenToAdd = stopPlace.children
          .filter((child) => child.notSaved)
          .map((child) => child.id);

        const variables = mapToMutationVariables.mapParentStopToVariables(
          stopPlace as any,
          userInput,
        );

        if (childrenToAdd.length) {
          dispatch(addToMultiModalStopPlace(stopPlace.id!, childrenToAdd)).then(
            () => {
              dispatch(saveParentStopPlace(variables)).then(({ data }) => {
                if (data?.mutateParentStopPlace?.[0]?.id) {
                  dispatch(
                    getStopPlaceVersions(data.mutateParentStopPlace[0].id),
                  );
                  dispatch(
                    getNeighbourStops(
                      data.mutateParentStopPlace[0].id,
                      activeMap?.getBounds(),
                    ),
                  );
                }
              });
            },
          );
        } else {
          dispatch(saveParentStopPlace(variables)).then(({ data }) => {
            if (data?.mutateParentStopPlace?.[0]?.id) {
              dispatch(getStopPlaceVersions(data.mutateParentStopPlace[0].id));
              dispatch(
                getNeighbourStops(
                  data.mutateParentStopPlace[0].id,
                  activeMap?.getBounds(),
                ),
              );
            }
          });
        }
      }
    },
    [stopPlace, dispatch, activeMap],
  );

  // Go back handlers
  const handleAllowUserToGoBack = useCallback(() => {
    if (isModified) {
      setConfirmGoBackOpen(true);
    } else {
      dispatch(UserActions.navigateTo("/", ""));
    }
  }, [isModified, dispatch]);

  const handleGoBack = useCallback(() => {
    setConfirmGoBackOpen(false);
    dispatch(UserActions.navigateTo("/", ""));
  }, [dispatch]);

  const handleCancelGoBack = useCallback(() => {
    setConfirmGoBackOpen(false);
  }, []);

  // Undo handlers
  const handleOpenUndoDialog = useCallback(() => {
    setConfirmUndoOpen(true);
  }, []);

  const handleCloseUndoDialog = useCallback(() => {
    setConfirmUndoOpen(false);
  }, []);

  const handleUndo = useCallback(() => {
    setConfirmUndoOpen(false);
    dispatch(StopPlaceActions.discardChangesForEditingStop());
  }, [dispatch]);

  // Terminate/Delete handlers
  const handleOpenTerminateDialog = useCallback(() => {
    if (stopPlace?.id) {
      dispatch(UserActions.requestTerminateStopPlace(stopPlace.id));
    }
  }, [stopPlace, dispatch]);

  const handleCloseTerminateDialog = useCallback(() => {
    dispatch(UserActions.hideDeleteStopDialog());
  }, [dispatch]);

  const handleTerminate = useCallback(
    (
      shouldHardDelete: boolean,
      shouldTerminatePermanently: boolean,
      comment: string,
      dateTime: string,
    ) => {
      if (!stopPlace?.id) return;

      if (shouldHardDelete) {
        dispatch(deleteStopPlace(stopPlace.id)).then((response) => {
          dispatch(UserActions.hideDeleteStopDialog());
          if (response.data.deleteStopPlace) {
            dispatch(UserActions.navigateToMainAfterDelete());
          }
        });
      } else {
        dispatch(
          terminateStop(
            stopPlace.id,
            shouldTerminatePermanently,
            comment,
            dateTime,
          ),
        ).then(() => {
          dispatch(getStopPlaceVersions(stopPlace.id!));
          dispatch(UserActions.hideDeleteStopDialog());
        });
      }
    },
    [stopPlace, dispatch],
  );

  // Child handlers
  const handleOpenRemoveChildDialog = useCallback((stopPlaceId: string) => {
    setRemovingChildId(stopPlaceId);
    setRemoveChildDialogOpen(true);
  }, []);

  const handleCloseRemoveChildDialog = useCallback(() => {
    setRemoveChildDialogOpen(false);
    setRemovingChildId("");
  }, []);

  const handleRemoveChild = useCallback(() => {
    if (!stopPlace?.id || !removingChildId) return;

    dispatch(
      removeStopPlaceFromMultiModalStop(stopPlace.id, removingChildId),
    ).then(() => {
      dispatch(getStopPlaceVersions(stopPlace.id!));
      setRemoveChildDialogOpen(false);
      setRemovingChildId("");
    });
  }, [stopPlace, removingChildId, dispatch]);

  const handleOpenAddChildDialog = useCallback(() => {
    setAddChildDialogOpen(true);
  }, []);

  const handleCloseAddChildDialog = useCallback(() => {
    setAddChildDialogOpen(false);
  }, []);

  const handleAddChildren = useCallback(
    (stopPlaceIds: string[]) => {
      // TODO: Implement add children logic
      setAddChildDialogOpen(false);
    },
    [dispatch],
  );

  // Adjacent site handlers
  const handleOpenAddAdjacentDialog = useCallback(() => {
    dispatch(UserActions.showAddAdjacentStopDialog());
  }, [dispatch]);

  const handleCloseAddAdjacentDialog = useCallback(() => {
    dispatch(UserActions.hideAddAdjacentStopDialog());
  }, [dispatch]);

  const handleAddAdjacentSite = useCallback(
    (stopPlaceId1: string, stopPlaceId2: string) => {
      dispatch(
        StopPlaceActions.addAdjacentConnection(stopPlaceId1, stopPlaceId2),
      );
      dispatch(UserActions.hideAddAdjacentStopDialog());
    },
    [dispatch],
  );

  // Alt names handlers
  const handleOpenAltNamesDialog = useCallback(() => {
    setAltNamesDialogOpen(true);
  }, []);

  const handleCloseAltNamesDialog = useCallback(() => {
    setAltNamesDialogOpen(false);
  }, []);

  // Tags handlers
  const handleOpenTagsDialog = useCallback(() => {
    setTagsDialogOpen(true);
  }, []);

  const handleCloseTagsDialog = useCallback(() => {
    setTagsDialogOpen(false);
  }, []);

  // Coordinates handlers
  const handleOpenCoordinatesDialog = useCallback(() => {
    setCoordinatesDialogOpen(true);
  }, []);

  const handleCloseCoordinatesDialog = useCallback(() => {
    setCoordinatesDialogOpen(false);
  }, []);

  const handleSetCoordinates = useCallback(
    (position: [number, number]) => {
      dispatch(StopPlaceActions.changeCurrentStopPosition(position));
      dispatch(StopPlaceActions.changeMapCenter(position, 14));
      setCoordinatesDialogOpen(false);
    },
    [dispatch],
  );

  // Field change handlers
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

  const handleUrlChange = useCallback(
    (value: string) => {
      dispatch(StopPlaceActions.changeStopUrl(value));
    },
    [dispatch],
  );

  const handleRemoveAdjacentSite = useCallback(
    (stopPlaceId: string, adjacentRef: string) => {
      dispatch(
        StopPlaceActions.removeAdjacentConnection(stopPlaceId, adjacentRef),
      );
    },
    [dispatch],
  );

  // Tag handlers
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
    stopPlace,
    originalStopPlace,
    isModified,
    canEdit,
    canDelete,
    versions,
    isLoading,
    confirmSaveDialogOpen,
    confirmGoBackOpen,
    confirmUndoOpen,
    terminateStopDialogOpen,
    removeChildDialogOpen,
    addChildDialogOpen,
    addAdjacentDialogOpen,
    altNamesDialogOpen,
    tagsDialogOpen,
    coordinatesDialogOpen,
    handleOpenSaveDialog,
    handleCloseSaveDialog,
    handleSave,
    handleAllowUserToGoBack,
    handleGoBack,
    handleCancelGoBack,
    handleOpenUndoDialog,
    handleCloseUndoDialog,
    handleUndo,
    handleOpenTerminateDialog,
    handleCloseTerminateDialog,
    handleTerminate,
    handleOpenRemoveChildDialog,
    handleCloseRemoveChildDialog,
    handleRemoveChild,
    handleOpenAddChildDialog,
    handleCloseAddChildDialog,
    handleAddChildren,
    handleOpenAddAdjacentDialog,
    handleCloseAddAdjacentDialog,
    handleAddAdjacentSite,
    handleOpenAltNamesDialog,
    handleCloseAltNamesDialog,
    handleOpenTagsDialog,
    handleCloseTagsDialog,
    handleOpenCoordinatesDialog,
    handleCloseCoordinatesDialog,
    handleSetCoordinates,
    handleNameChange,
    handleDescriptionChange,
    handleUrlChange,
    handleRemoveAdjacentSite,
    handleAddTag,
    handleGetTags,
    handleRemoveTag,
    handleFindTagByName,
    removingChildId,
  };
};
