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

import { ReactNode } from "react";
import { Entities } from "../../../models/Entities";

export interface SearchBoxProps {
  // No props needed as we use Redux selectors
}

export interface SearchResult {
  id: string;
  name: string;
  entityType: keyof typeof Entities;
  isParent?: boolean;
  coordinates?: [number, number];
  description?: string;
  modalities?: string[];
  hasExpired?: boolean;
  hasExpiredParts?: boolean;
  hasQuays?: boolean;
  tags?: string[];
  stopPlaceType?: string;
  submode?: string;
  transportMode?: string;
  weighting?: string;

  // Additional properties for detailed results
  topographicPlace?: string;
  parentTopographicPlace?: string;
  belongsToGroup?: boolean;
  groups?: Array<{ id: string; name: string }>;
  importedId?: string[];
  children?: SearchResult[];
  members?: SearchResult[];
  quays?: Array<{
    id: string;
    publicCode?: string;
    privateCode?: { value: string };
    importedId?: string[];
  }>;
  isMissingLocation?: boolean;
  accessibilityAssessment?: {
    limitations?: {
      wheelchairAccess?: string;
    };
  };
}

export interface TopographicalPlace {
  id: string;
  name: {
    value: string;
  };
  topographicPlaceType: "county" | "municipality" | "country";
  parentTopographicPlace?: {
    name: {
      value: string;
    };
  };
}

export interface TopoChip {
  text: string;
  type: string;
  value: string;
}

export interface MenuItem {
  element: SearchResult | null;
  text: string;
  id: string | null;
  menuDiv: ReactNode;
}

export interface TopographicalDataSource {
  text: string;
  id: string;
  value: ReactNode;
  type: string;
}

export interface FavoriteFilter {
  searchText: string;
  stopType: string[];
  topoiChips: TopoChip[];
  showFutureAndExpired: boolean;
}

export interface UseSearchBoxProps {
  chosenResult: SearchResult | null;
  dataSource: SearchResult[];
  stopTypeFilter: string[];
  topoiChips: TopoChip[];
  topographicalPlaces: TopographicalPlace[];
  showFutureAndExpired: boolean;
  searchText: string;
  formatMessage: (descriptor: { id: string }) => string;
}

export interface UseSearchBoxReturn {
  // Local state
  showMoreFilterOptions: boolean;
  loading: boolean;
  stopPlaceSearchValue: string;
  topographicPlaceFilterValue: string;
  coordinatesDialogOpen: boolean;
  createNewStopOpen: boolean;
  anchorEl: HTMLElement | null;

  // Handlers
  handleSearchUpdate: (event: any, searchText: string, reason?: string) => void;
  handleNewRequest: (event: any, result: MenuItem, reason?: string) => void;
  handleApplyModalityFilters: (filters: string[]) => void;
  handleToggleFilter: (value: boolean) => void;
  handleAddChip: (event: any, value: TopographicalDataSource | null) => void;
  handleDeleteChip: (chipValue: string) => void;
  handleSaveAsFavorite: () => void;
  handleRetrieveFilter: (filter: FavoriteFilter) => void;
  handleEdit: (id: string, entityType: keyof typeof Entities) => void;
  handleNewStop: (isMultiModal: boolean) => void;
  handleLookupCoordinates: (position: [number, number]) => void;
  handleSubmitCoordinates: (position: [number, number]) => void;
  handleOpenCoordinatesDialog: () => void;
  handleOpenLookupCoordinatesDialog: () => void;
  handleCloseLookupCoordinatesDialog: () => void;
  handleCloseCoordinatesDialog: () => void;
  handleTopographicalPlaceInput: (
    event: any,
    searchText: string,
    reason?: string,
  ) => void;
  removeFiltersAndSearch: () => void;
  toggleShowFutureAndExpired: (value: boolean) => void;

  // Computed values
  menuItems: MenuItem[];
  topographicalPlacesDataSource: TopographicalDataSource[];
}

// Redux State Types (simplified - you may need to adjust based on your actual Redux state)
export interface RootState {
  stopPlace: {
    activeSearchResult: SearchResult | null;
    searchResults: SearchResult[];
    topographicalPlaces: TopographicalPlace[];
    current: {
      permissions?: {
        canEdit: boolean;
      };
    };
    permissions?: {
      canEdit: boolean;
    };
  };
  user: {
    isCreatingNewStop: boolean;
    searchFilters: {
      stopType: string[];
      topoiChips: TopoChip[];
      text: string;
      showFutureAndExpired: boolean;
    };
    favorited: boolean;
    missingCoordsMap: Record<string, [number, number]>;
    lookupCoordinatesOpen: boolean;
    newStopIsMultiModal: boolean;
    isGuest: boolean;
  };
}

// Component Props Types
export interface FavoriteSectionProps {
  favorited: boolean;
  stopTypeFilter: string[];
  onRetrieveFilter: (filter: FavoriteFilter) => void;
  onSaveAsFavorite: () => void;
}

export interface FilterSectionProps {
  showMoreFilterOptions: boolean;
  stopTypeFilter: string[];
  topographicalPlacesDataSource: TopographicalDataSource[];
  topographicPlaceFilterValue: string;
  topoiChips: TopoChip[];
  showFutureAndExpired: boolean;
  onToggleFilter: (value: boolean) => void;
  onApplyModalityFilters: (filters: string[]) => void;
  onTopographicalPlaceInput: (
    event: any,
    searchText: string,
    reason?: string,
  ) => void;
  onAddChip: (event: any, value: TopographicalDataSource | null) => void;
  onDeleteChip: (chipValue: string) => void;
  onToggleShowFutureAndExpired: (value: boolean) => void;
}

export interface SearchInputProps {
  menuItems: MenuItem[];
  loading: boolean;
  stopPlaceSearchValue: string;
  showFilters?: boolean;
  activeFilterCount?: number;
  showFavorites?: boolean;
  onSearchUpdate: (event: any, searchText: string, reason?: string) => void;
  onNewRequest: (event: any, result: MenuItem, reason?: string) => void;
  onToggleFilters?: () => void;
  onToggleFavorites?: () => void;
}

export interface SearchResultDetailsProps {
  result: SearchResult;
  canEdit: boolean;
  userSuppliedCoordinates?: [number, number];
  onEdit: (id: string, entityType: keyof typeof Entities) => void;
  onChangeCoordinates: () => void;
}

export interface ActionButtonsProps {
  isCreatingNewStop: boolean;
  newStopIsMultiModal: boolean;
  createNewStopOpen: boolean;
  anchorEl: HTMLElement | null;
  onOpenLookupCoordinates: () => void;
  onNewStop: (isMultiModal: boolean) => void;
}

export interface CoordinatesDialogsProps {
  lookupCoordinatesOpen: boolean;
  coordinatesDialogOpen: boolean;
  onCloseLookupCoordinates: () => void;
  onSubmitLookupCoordinates: (position: [number, number]) => void;
  onCloseCoordinates: () => void;
  onSubmitCoordinates: (position: [number, number]) => void;
}
