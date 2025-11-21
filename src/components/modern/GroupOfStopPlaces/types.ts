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

// Stop Place interfaces
export interface StopPlaceChild {
  stopPlaceType: string;
  submode?: string;
}

export interface AdjacentSite {
  id: string;
  name: string;
}

export interface StopPlace {
  id: string;
  name: string;
  stopPlaceType: string;
  submode?: string;
  isParent?: boolean;
  children?: StopPlaceChild[];
  adjacentSites?: AdjacentSite[];
  hasExpired?: boolean;
}

// Group of Stop Places interfaces
export interface GroupOfStopPlacesPermissions {
  canEdit: boolean;
  canDelete: boolean;
}

export interface GroupOfStopPlaces {
  id?: string;
  name: string;
  description?: string;
  members: StopPlace[];
  permissions?: GroupOfStopPlacesPermissions;
  created?: string;
  modified?: string;
  version?: string;
}

// Redux state interfaces
export interface StopPlacesGroupState {
  current: GroupOfStopPlaces;
  original: GroupOfStopPlaces;
  isModified: boolean;
  centerPosition?: [number, number];
}

export interface RootState {
  stopPlacesGroup: StopPlacesGroupState;
  stopPlace: {
    neighbourStops?: StopPlace[];
  };
}

// Component Props interfaces
export interface EditGroupOfStopPlacesProps {
  open?: boolean;
  onClose?: () => void;
}

export interface GroupOfStopPlacesHeaderProps {
  groupOfStopPlaces: GroupOfStopPlaces;
  onGoBack: () => void;
  onCollapse?: () => void;
}

export interface GroupOfStopPlacesDetailsProps {
  name: string;
  description?: string;
  canEdit: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export interface GroupOfStopPlacesListProps {
  stopPlaces: StopPlace[];
  canEdit: boolean;
  onAddMembers: (memberIds: string[]) => void;
  onRemoveMember: (stopPlaceId: string) => void;
}

export interface GroupOfStopPlacesActionsProps {
  hasId: boolean;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;
  hasName: boolean;
  onRemove: () => void;
  onUndo: () => void;
  onSave: () => void;
}

export interface StopPlaceListItemProps {
  stopPlace: StopPlace;
  onRemove?: (stopPlaceId: string) => void;
  disabled?: boolean;
}

// Dialog Props interfaces
export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onClose: () => void;
}

export interface SaveGroupDialogProps {
  open: boolean;
  onSave: () => void;
  onClose: () => void;
}

export interface AddMemberToGroupProps {
  open: boolean;
  onConfirm: (memberIds: string[]) => void;
  onClose: () => void;
}

// Hook return types
export interface UseEditGroupOfStopPlacesReturn {
  // State
  groupOfStopPlaces: GroupOfStopPlaces;
  originalGOS: GroupOfStopPlaces;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;

  // Dialog states
  confirmSaveDialogOpen: boolean;
  confirmGoBackOpen: boolean;
  confirmUndoOpen: boolean;
  confirmDeleteDialogOpen: boolean;

  // Handlers
  handleOpenSaveDialog: () => void;
  handleCloseSaveDialog: () => void;
  handleSave: () => void;

  handleAllowUserToGoBack: () => void;
  handleGoBack: () => void;
  handleCancelGoBack: () => void;

  handleOpenUndoDialog: () => void;
  handleCloseUndoDialog: () => void;
  handleUndo: () => void;

  handleOpenDeleteDialog: () => void;
  handleCloseDeleteDialog: () => void;
  handleDelete: () => void;

  handleNameChange: (value: string) => void;
  handleDescriptionChange: (value: string) => void;
  handleAddMembers: (memberIds: string[]) => void;
  handleRemoveMember: (stopPlaceId: string) => void;
}

// Shared component props
export interface CopyIdButtonProps {
  idToCopy?: string;
  size?: "small" | "medium" | "large";
  color?: string;
}

export interface MinimizedBarProps {
  name?: string;
  id?: string;
  onExpand: () => void;
  onClose: () => void;
  isMobile: boolean;
}
