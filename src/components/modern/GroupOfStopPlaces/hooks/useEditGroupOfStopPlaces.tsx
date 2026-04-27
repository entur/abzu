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

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StopPlacesGroupActions, UserActions } from "../../../../actions/";
import {
  deleteGroupOfStopPlaces,
  mutateGroupOfStopPlace,
} from "../../../../actions/TiamatActions";
import * as types from "../../../../actions/Types";
import mapHelper from "../../../../modelUtils/mapToQueryVariables";
import Routes from "../../../../routes/";
import { RootState, UseEditGroupOfStopPlacesReturn } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppDispatch = any;

/**
 * Custom hook for managing group of stop places editing logic
 * Handles all state management and business logic
 */
export const useEditGroupOfStopPlaces = (): UseEditGroupOfStopPlacesReturn => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const groupOfStopPlaces = useSelector(
    (state: RootState) => state.stopPlacesGroup.current,
  );
  const originalGOS = useSelector(
    (state: RootState) => state.stopPlacesGroup.original,
  );
  const isModified = useSelector(
    (state: RootState) => state.stopPlacesGroup.isModified,
  );
  const canEdit = groupOfStopPlaces.permissions?.canEdit ?? false;
  const canDelete = groupOfStopPlaces.permissions?.canDelete ?? false;

  // Dialog states
  const [confirmSaveDialogOpen, setConfirmSaveDialogOpen] = useState(false);
  const [confirmGoBackOpen, setConfirmGoBackOpen] = useState(false);
  const [confirmUndoOpen, setConfirmUndoOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  // Save handlers
  const handleOpenSaveDialog = () => setConfirmSaveDialogOpen(true);
  const handleCloseSaveDialog = () => setConfirmSaveDialogOpen(false);

  const handleSave = () => {
    const variables =
      mapHelper.mapGroupOfStopPlaceToVariables(groupOfStopPlaces);
    dispatch(mutateGroupOfStopPlace(variables)).then((groupId: any) => {
      setConfirmSaveDialogOpen(false);
      if (groupId) {
        dispatch(
          UserActions.navigateTo(`/${Routes.GROUP_OF_STOP_PLACE}/`, groupId),
        );
        dispatch(UserActions.openSnackbar(types.SUCCESS));
      }
    });
  };

  // Go back handlers
  const handleAllowUserToGoBack = () => {
    if (isModified) {
      setConfirmGoBackOpen(true);
    } else {
      handleGoBack();
    }
  };

  const handleGoBack = () => {
    setConfirmGoBackOpen(false);
    dispatch(UserActions.navigateTo("/", ""));
  };

  const handleCancelGoBack = () => setConfirmGoBackOpen(false);

  // Undo handlers
  const handleOpenUndoDialog = () => setConfirmUndoOpen(true);
  const handleCloseUndoDialog = () => setConfirmUndoOpen(false);

  const handleUndo = () => {
    setConfirmUndoOpen(false);
    dispatch(StopPlacesGroupActions.discardChanges());
  };

  // Delete handlers
  const handleOpenDeleteDialog = () => setConfirmDeleteDialogOpen(true);
  const handleCloseDeleteDialog = () => setConfirmDeleteDialogOpen(false);

  const handleDelete = () => {
    if (groupOfStopPlaces.id) {
      dispatch(deleteGroupOfStopPlaces(groupOfStopPlaces.id)).then(() => {
        dispatch(UserActions.navigateTo("/", ""));
      });
    }
  };

  // Form field handlers
  const handleNameChange = (value: string) => {
    dispatch(StopPlacesGroupActions.changeName(value));
  };

  const handleDescriptionChange = (value: string) => {
    dispatch(StopPlacesGroupActions.changeDescription(value));
  };

  // Member handlers
  const handleAddMembers = (memberIds: string[]) => {
    dispatch(StopPlacesGroupActions.addMembersToGroup(memberIds));
  };

  const handleRemoveMember = (stopPlaceId: string) => {
    dispatch(StopPlacesGroupActions.removeMemberFromGroup(stopPlaceId));
  };

  return {
    // State
    groupOfStopPlaces,
    originalGOS,
    isModified,
    canEdit,
    canDelete,

    // Dialog states
    confirmSaveDialogOpen,
    confirmGoBackOpen,
    confirmUndoOpen,
    confirmDeleteDialogOpen,

    // Handlers
    handleOpenSaveDialog,
    handleCloseSaveDialog,
    handleSave,

    handleAllowUserToGoBack,
    handleGoBack,
    handleCancelGoBack,

    handleOpenUndoDialog,
    handleCloseUndoDialog,
    handleUndo,

    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDelete,

    handleNameChange,
    handleDescriptionChange,
    handleAddMembers,
    handleRemoveMember,
  };
};
