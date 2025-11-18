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
export interface ChildStopPlace {
  id: string;
  name: string;
  stopPlaceType: string;
  submode?: string;
  notSaved?: boolean;
}

export interface AdjacentSite {
  id: string;
  name: string;
  ref: string;
}

export interface AlternativeName {
  name: {
    value: string;
    lang: string;
  };
  nameType: string;
}

export interface Tag {
  name: string;
  comment?: string;
}

export interface ValidBetween {
  fromDate?: string;
  toDate?: string;
}

export interface ParentStopPlace {
  id?: string;
  name: string;
  description?: string;
  url?: string;
  location?: [number, number];
  position?: [number, number];
  topographicPlace?: string;
  parentTopographicPlace?: string;
  children: ChildStopPlace[];
  adjacentSites?: AdjacentSite[];
  alternativeNames?: AlternativeName[];
  tags?: Tag[];
  version?: number;
  hasExpired?: boolean;
  isNewStop?: boolean;
  importedId?: string;
  belongsToGroup?: boolean;
  groups?: Array<{ id: string; name: string }>;
  validBetween?: ValidBetween;
  permanentlyTerminated?: boolean;
}

export interface ParentStopPlacePermissions {
  canEdit: boolean;
  canDelete: boolean;
}

// Redux state interfaces
export interface ParentStopPlaceState {
  current: ParentStopPlace | null;
  originalCurrent: ParentStopPlace | null;
  stopHasBeenModified: boolean;
  loading: boolean;
  versions: Array<{ version: number; fromDate: string }>;
}

export interface RootState {
  stopPlace: ParentStopPlaceState;
  mapUtils: {
    activeMap: any;
    removeStopPlaceFromParentOpen: boolean;
    removingStopPlaceFromParentId: string;
    deleteStopDialogOpen: boolean;
  };
  user: {
    adjacentStopDialogOpen: boolean;
    serverTimeDiff: number;
    deleteStopDialogWarning?: string;
  };
}

// Component Props interfaces
export interface EditParentStopPlaceProps {
  open?: boolean;
  onClose?: () => void;
}

export interface ParentStopPlaceHeaderProps {
  stopPlace: ParentStopPlace;
  originalStopPlace: ParentStopPlace;
  onGoBack: () => void;
  onCollapse?: () => void;
}

export interface ParentStopPlaceDetailsProps {
  name: string;
  description?: string;
  url?: string;
  location?: [number, number];
  hasExpired?: boolean;
  version?: number;
  tags?: Tag[];
  importedId?: string;
  alternativeNames?: AlternativeName[];
  belongsToGroup?: boolean;
  groups?: Array<{ id: string; name: string }>;
  canEdit: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onOpenAltNames: () => void;
  onOpenTags: () => void;
  onOpenCoordinates: () => void;
}

export interface ParentStopPlaceChildrenProps {
  children: ChildStopPlace[];
  adjacentSites?: AdjacentSite[];
  canEdit: boolean;
  isLoading?: boolean;
  onAddChildren: () => void;
  onRemoveChild: (stopPlaceId: string) => void;
  onRemoveAdjacentSite: (stopPlaceId: string, adjacentRef: string) => void;
  onAddAdjacentSite: () => void;
}

export interface ParentStopPlaceActionsProps {
  hasId: boolean;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;
  hasName: boolean;
  hasExpired: boolean;
  hasChildren: boolean;
  onTerminate: () => void;
  onUndo: () => void;
  onSave: () => void;
}

export interface ChildStopPlaceListItemProps {
  child: ChildStopPlace;
  onRemove?: (stopPlaceId: string) => void;
  disabled?: boolean;
}

export interface AdjacentSiteListItemProps {
  site: AdjacentSite;
  onRemove?: (stopPlaceId: string, adjacentRef: string) => void;
  disabled?: boolean;
}

// Hook return types
export interface UseEditParentStopPlaceReturn {
  // State
  stopPlace: ParentStopPlace | null;
  originalStopPlace: ParentStopPlace | null;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;
  versions: Array<{ version: number; fromDate: string }>;
  isLoading: boolean;

  // Dialog states
  confirmSaveDialogOpen: boolean;
  confirmGoBackOpen: boolean;
  confirmUndoOpen: boolean;
  terminateStopDialogOpen: boolean;
  removeChildDialogOpen: boolean;
  addChildDialogOpen: boolean;
  addAdjacentDialogOpen: boolean;
  altNamesDialogOpen: boolean;
  tagsDialogOpen: boolean;
  coordinatesDialogOpen: boolean;

  // Handlers
  handleOpenSaveDialog: () => void;
  handleCloseSaveDialog: () => void;
  handleSave: (userInput: any) => void;

  handleAllowUserToGoBack: () => void;
  handleGoBack: () => void;
  handleCancelGoBack: () => void;

  handleOpenUndoDialog: () => void;
  handleCloseUndoDialog: () => void;
  handleUndo: () => void;

  handleOpenTerminateDialog: () => void;
  handleCloseTerminateDialog: () => void;
  handleTerminate: (
    shouldHardDelete: boolean,
    shouldTerminatePermanently: boolean,
    comment: string,
    dateTime: string,
  ) => void;

  handleOpenRemoveChildDialog: (stopPlaceId: string) => void;
  handleCloseRemoveChildDialog: () => void;
  handleRemoveChild: () => void;

  handleOpenAddChildDialog: () => void;
  handleCloseAddChildDialog: () => void;
  handleAddChildren: (stopPlaceIds: string[]) => void;

  handleOpenAddAdjacentDialog: () => void;
  handleCloseAddAdjacentDialog: () => void;
  handleAddAdjacentSite: (stopPlaceId1: string, stopPlaceId2: string) => void;

  handleOpenAltNamesDialog: () => void;
  handleCloseAltNamesDialog: () => void;

  handleOpenTagsDialog: () => void;
  handleCloseTagsDialog: () => void;

  handleOpenCoordinatesDialog: () => void;
  handleCloseCoordinatesDialog: () => void;
  handleSetCoordinates: (position: [number, number]) => void;

  handleNameChange: (value: string) => void;
  handleDescriptionChange: (value: string) => void;
  handleUrlChange: (value: string) => void;
  handleRemoveAdjacentSite: (stopPlaceId: string, adjacentRef: string) => void;
  handleAddTag: (idReference: string, name: string, comment: string) => any;
  handleGetTags: (idReference: string) => any;
  handleRemoveTag: (name: string, idReference: string) => any;
  handleFindTagByName: (name: string) => any;

  removingChildId: string;
}

export interface MinimizedBarProps {
  name?: string;
  id?: string;
  onExpand: () => void;
  onClose: () => void;
  isMobile: boolean;
}
