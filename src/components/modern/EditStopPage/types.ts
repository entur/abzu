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

// --- Core domain types ---

export interface Tag {
  name: string;
  comment?: string;
}

export interface ValidBetween {
  fromDate?: string;
  toDate?: string;
}

export interface Quay {
  id?: string;
  location?: number[];
  publicCode?: string;
  privateCode?: { value?: string } | string;
  description?: string;
  compassBearing?: number;
  importedId?: string[];
  keyValues?: Array<{ key: string; values: string[] }>;
  notSaved?: boolean;
  accessibilityAssessment?: {
    limitations?: {
      wheelchairAccess?: string;
      stepFreeAccess?: string;
      audibleSignalsAvailable?: string;
      visualSignsAvailable?: string;
      escalatorFreeAccess?: string;
      liftFreeAccess?: string;
    };
  };
  boardingPositions?: Array<{
    id?: string;
    publicCode?: string;
    location?: [number, number];
  }>;
  // Equipment / facilities (managed by EquipmentActions)
  placeEquipments?: any;
  mobilityFacilities?: any[];
  facilities?: any[];
}

export interface Parking {
  id?: string;
  name?: string;
  parkingType?: string;
  parkingLayout?: string;
  parkingPaymentProcess?: string[];
  rechargingAvailable?: boolean | null;
  totalCapacity?: number | string;
  numberOfSpaces?: number | string;
  numberOfSpacesWithRechargePoint?: number | string;
  numberOfSpacesForRegisteredDisabledUserType?: number | string;
  hasExpired?: boolean;
  validBetween?: ValidBetween;
  accessibilityAssessment?: {
    limitations?: {
      stepFreeAccess?: string;
    };
  };
  notSaved?: boolean;
}

export interface StopPlace {
  id?: string;
  name: string;
  description?: string;
  stopPlaceType?: string;
  submode?: string;
  quays?: Quay[];
  parking?: Parking[];
  tags?: Tag[];
  importedId?: string[];
  alternativeNames?: any[];
  keyValues?: Array<{ key: string; values: string[] }>;
  isParent?: boolean;
  isNewStop?: boolean;
  isChildOfParent?: boolean;
  parentStop?: { id: string; name: string };
  groups?: Array<{ id: string; name: string }>;
  hasExpired?: boolean;
  permanentlyTerminated?: boolean;
  validBetween?: ValidBetween;
  version?: number;
  topographicPlace?: string;
  parentTopographicPlace?: string;
  location?: [number, number];
  weighting?: string;
}

// --- Component props ---

export interface EditStopPageProps {
  open?: boolean;
}

export interface StopPlaceGeneralSectionProps {
  stopPlace: StopPlace;
  canEdit: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTypeChange: (type: string) => void;
  onSubmodeChange: (submode: string) => void;
  onWeightingChange: (value: string) => void;
  version?: number;
  onOpenVersions: () => void;
  onOpenTimetable?: () => void;
  onOpenTags: () => void;
  onOpenAltNames: () => void;
  onOpenKeyValues: () => void;
}

export interface QuaysSectionProps {
  quays: Quay[];
  canEdit: boolean;
  onDeleteQuay: (index: number) => void;
  onNavigateToQuay: (index: number) => void;
  onAddQuay: () => void;
}

export interface QuayItemProps {
  quay: Quay;
  index: number;
  canEdit: boolean;
  onDelete: () => void;
  onNavigate: () => void;
}

export interface ParkingSectionProps {
  parking: Parking[];
  canEdit: boolean;
  onDeleteParking: (index: number) => void;
  onNavigateToParking: (index: number) => void;
  onAddParking: (type: string) => void;
}

export interface ParkingItemProps {
  parking: Parking;
  index: number;
  canEdit: boolean;
  onDelete: () => void;
  onNavigate: () => void;
}

export interface QuayPanelProps {
  quayIndex: number;
  stopPlace: StopPlace;
  canEdit: boolean;
  onBack: () => void;
  onDelete: (index: number) => void;
  onSave: () => void;
  onPublicCodeChange: (index: number, value: string) => void;
  onPrivateCodeChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
}

export interface ParkingPanelProps {
  parkingIndex: number;
  stopPlace: StopPlace;
  canEdit: boolean;
  onBack: () => void;
  onDelete: (index: number) => void;
  onNameChange: (index: number, value: string) => void;
  onTypeChange: (index: number, value: string) => void;
  onCapacityChange: (index: number, value: string) => void;
}

export interface StopPlaceDialogsProps {
  stopPlace: StopPlace | null;
  canEdit: boolean;
  canDelete: boolean;
  formatMessage: (descriptor: { id: string }) => string;
  confirmSaveDialogOpen: boolean;
  confirmGoBackOpen: boolean;
  confirmUndoOpen: boolean;
  terminateStopDialogOpen: boolean;
  deleteQuayDialogOpen: boolean;
  deleteParkingDialogOpen: boolean;
  requiredFieldsMissingOpen: boolean;
  tagsDialogOpen: boolean;
  altNamesDialogOpen: boolean;
  keyValuesDialogOpen: boolean;
  versionsDialogOpen: boolean;
  infoDialogOpen: boolean;
  nameDescriptionDialogOpen: boolean;
  versions: any[];
  handleSave: (userInput: any) => void;
  handleCloseSaveDialog: () => void;
  handleGoBack: () => void;
  handleCancelGoBack: () => void;
  handleUndo: () => void;
  handleCloseUndoDialog: () => void;
  handleTerminate: (
    shouldHardDelete: boolean,
    shouldTerminatePermanently: boolean,
    comment: string,
    dateTime: string,
  ) => void;
  handleCloseTerminateDialog: () => void;
  handleConfirmDeleteQuay: () => void;
  handleCloseDeleteQuayDialog: () => void;
  handleConfirmDeleteParking: () => void;
  handleCloseDeleteParkingDialog: () => void;
  handleCloseRequiredFieldsMissing: () => void;
  handleCloseTagsDialog: () => void;
  handleAddTag: (idReference: string, name: string, comment: string) => any;
  handleGetTags: (idReference: string) => any;
  handleRemoveTag: (name: string, idReference: string) => any;
  handleFindTagByName: (name: string) => any;
  handleCloseAltNamesDialog: () => void;
  handleCloseKeyValuesDialog: () => void;
  handleCloseVersionsDialog: () => void;
  handleCloseInfoDialog: () => void;
  handleCloseNameDescriptionDialog: () => void;
  handleNameChange: (name: string) => void;
  handleDescriptionChange: (description: string) => void;
}

// --- Hook return types ---

export interface UseEditStopPageReturn {
  // State
  stopPlace: StopPlace | null;
  originalStopPlace: StopPlace | null;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;

  // Versions
  versions: any[];

  // Dialog states
  confirmSaveDialogOpen: boolean;
  confirmGoBackOpen: boolean;
  confirmUndoOpen: boolean;
  terminateStopDialogOpen: boolean;
  deleteQuayDialogOpen: boolean;
  deleteParkingDialogOpen: boolean;
  requiredFieldsMissingOpen: boolean;
  tagsDialogOpen: boolean;
  altNamesDialogOpen: boolean;
  keyValuesDialogOpen: boolean;
  versionsDialogOpen: boolean;
  infoDialogOpen: boolean;
  nameDescriptionDialogOpen: boolean;

  // Dialog handlers
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
  handleCloseDeleteQuayDialog: () => void;
  handleConfirmDeleteQuay: () => void;
  handleCloseDeleteParkingDialog: () => void;
  handleConfirmDeleteParking: () => void;
  handleOpenRequiredFieldsMissing: () => void;
  handleCloseRequiredFieldsMissing: () => void;
  handleOpenTagsDialog: () => void;
  handleCloseTagsDialog: () => void;
  handleOpenAltNamesDialog: () => void;
  handleCloseAltNamesDialog: () => void;
  handleOpenKeyValuesDialog: () => void;
  handleCloseKeyValuesDialog: () => void;
  handleOpenVersionsDialog: () => void;
  handleCloseVersionsDialog: () => void;
  handleOpenInfoDialog: () => void;
  handleCloseInfoDialog: () => void;
  handleOpenNameDescriptionDialog: () => void;
  handleCloseNameDescriptionDialog: () => void;

  // Form handlers
  handleNameChange: (value: string) => void;
  handleDescriptionChange: (value: string) => void;
  handleTypeChange: (type: string) => void;
  handleSubmodeChange: (stopPlaceType: string, submode: string) => void;
  handleWeightingChange: (value: string) => void;
  handleAddTag: (idReference: string, name: string, comment: string) => any;
  handleGetTags: (idReference: string) => any;
  handleRemoveTag: (name: string, idReference: string) => any;
  handleFindTagByName: (name: string) => any;

  // Quay handlers
  handleDeleteQuay: (index: number) => void;
  handleQuayPublicCodeChange: (index: number, value: string) => void;
  handleQuayPrivateCodeChange: (index: number, value: string) => void;
  handleQuayDescriptionChange: (index: number, value: string) => void;
  handleAddQuay: (position: [number, number]) => void;

  // Parking handlers
  handleDeleteParking: (index: number) => void;
  handleParkingNameChange: (index: number, value: string) => void;
  handleParkingTypeChange: (index: number, value: string) => void;
  handleParkingCapacityChange: (index: number, value: string) => void;
  handleAddParking: (type: string, position: [number, number]) => void;
}
