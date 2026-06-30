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

import type React from "react";

export interface ChangelogPageProps {
  stopTypeFilter: string[];
  topoiChips: TopoChip[];
  topographicPlaceFilterValue: string;
  topographicalPlacesDataSource: TopoChip[];
  searchQuery: string;
  isLoading: boolean;
  results: StopPlaceResult[] | null;
  versionsMap: Record<string, VersionEntry>;
  onApplyModalityFilters: (filters: string[]) => void;
  onSearchQueryChange: (query: string) => void;
  onTopographicalPlaceSearch: (
    event: React.SyntheticEvent,
    value: string,
    reason: string,
  ) => void;
  onAddChip: (event: React.SyntheticEvent, chip: TopoChip | null) => void;
  onDeleteChip: (id: string) => void;
  onSearch: () => void;
  onToggleVersions: (stopId: string) => void;
  favorites: ChangelogFavorite[];
  favoriteNameDialogOpen: boolean;
  onOpenSaveDialog: () => void;
  onCloseSaveDialog: () => void;
  onSaveFavorite: (title: string) => void;
  onLoadFavorite: (fav: ChangelogFavorite) => void;
  onDeleteFavorite: (title: string) => void;
}

export interface TopoChip {
  id: string;
  text: string;
  type: "municipality" | "county" | "country";
  value: React.ReactNode;
}

export interface ChangelogFavorite {
  title: string;
  searchQuery: string;
  stopTypeFilter: string[];
  topoiChips: Omit<TopoChip, "value">[];
}

export interface StopPlaceVersion {
  version: number;
  changedBy?: string | null;
  versionComment?: string | null;
  validBetween?: { fromDate?: string | null; toDate?: string | null } | null;
}

export interface VersionEntry {
  loading: boolean;
  versions: StopPlaceVersion[] | null;
  collapsed: boolean;
}

export interface StopPlaceResult {
  id: string;
  __typename: string;
  name?: { value: string } | null;
  stopPlaceType?: string | null;
  version: number;
  changedBy?: string | null;
  versionComment?: string | null;
  validBetween?: { fromDate?: string | null; toDate?: string | null } | null;
  topographicPlace?: {
    name: { value: string };
    topographicPlaceType: string;
    parentTopographicPlace?: { name: { value: string } } | null;
  } | null;
  children?: { stopPlaceType?: string | null }[] | null;
}
