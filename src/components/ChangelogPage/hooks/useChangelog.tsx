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

import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  findStopForChangelog,
  getStopPlaceVersions,
  getTopographicPlaces,
  topographicalPlaceSearch,
} from "../../../actions/TiamatActions";
import {
  buildReportSearchQuery,
  extractQueryParamsFromUrl,
} from "../../../utils/URLhelpers";
import type {
  ChangelogFavorite,
  ChangelogPageProps,
  StopPlaceResult,
  StopPlaceVersion,
  TopoChip,
  VersionEntry,
} from "../types";

const CHANGELOG_FAVORITES_KEY = "ABZU::changelog-favorites";

function loadFavoritesFromStorage(): ChangelogFavorite[] {
  try {
    const raw = localStorage.getItem(CHANGELOG_FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as ChangelogFavorite[]) : [];
  } catch {
    return [];
  }
}

function saveFavoritesToStorage(favs: ChangelogFavorite[]) {
  localStorage.setItem(CHANGELOG_FAVORITES_KEY, JSON.stringify(favs));
}

function createTopographicPlaceMenuItem(
  place: any,
  formatMessage: (descriptor: { id: string }) => string,
): TopoChip {
  let name: string = place.name.value;
  if (
    place.topographicPlaceType === "municipality" &&
    place.parentTopographicPlace
  ) {
    name += `, ${place.parentTopographicPlace.name.value}`;
  }
  return {
    text: name,
    id: place.id,
    value: (
      <div
        style={{
          marginLeft: 10,
          display: "flex",
          flexDirection: "column",
          minWidth: 380,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: "0.9em" }}>{name}</div>
          <div style={{ fontSize: "0.6em", color: "grey" }}>
            {formatMessage({ id: place.topographicPlaceType })}
          </div>
        </div>
      </div>
    ),
    type: place.topographicPlaceType,
  };
}

export const useChangelog = (): ChangelogPageProps => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const dispatchThunk = dispatch as any;
  const topographicalPlaces = useSelector(
    (state: any) => state.report.topographicalPlaces,
  );

  const [stopTypeFilter, setStopTypeFilter] = useState<string[]>([]);
  const [topoiChips, setTopoiChips] = useState<TopoChip[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [topographicPlaceFilterValue, setTopographicPlaceFilterValue] =
    useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<StopPlaceResult[] | null>(null);
  const [versionsMap, setVersionsMap] = useState<Record<string, VersionEntry>>(
    {},
  );
  const [favorites, setFavorites] = useState<ChangelogFavorite[]>(
    loadFavoritesFromStorage,
  );
  const [favoriteNameDialogOpen, setFavoriteNameDialogOpen] = useState(false);

  const topoSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fromURL = extractQueryParamsFromUrl();
    setSearchQuery(fromURL.query || "");
    setStopTypeFilter(
      fromURL.stopPlaceType ? fromURL.stopPlaceType.split(",") : [],
    );

    const topoIds: string[] = [];
    if (fromURL.municipalityReference)
      topoIds.push(...fromURL.municipalityReference.split(","));
    if (fromURL.countyReference)
      topoIds.push(...fromURL.countyReference.split(","));
    if (fromURL.countryReference)
      topoIds.push(...fromURL.countryReference.split(","));

    if (topoIds.length > 0) {
      dispatchThunk(getTopographicPlaces(topoIds)).then((response: any) => {
        if (response.data && Object.keys(response.data).length) {
          const chips: TopoChip[] = [];
          Object.keys(response.data).forEach((key) => {
            const place = response.data[key]?.length
              ? response.data[key][0]
              : null;
            if (place) {
              chips.push(createTopographicPlaceMenuItem(place, formatMessage));
            }
          });
          setTopoiChips(chips);
        }
      });
    }

    return () => {
      if (topoSearchTimerRef.current) clearTimeout(topoSearchTimerRef.current);
    };
  }, [dispatch, formatMessage]);

  const handleTopographicalPlaceSearch = (
    _event: React.SyntheticEvent,
    searchText: string,
    reason: string,
  ) => {
    if (reason === "reset") {
      if (topoSearchTimerRef.current) clearTimeout(topoSearchTimerRef.current);
      setTopographicPlaceFilterValue("");
      return;
    }
    setTopographicPlaceFilterValue(searchText);
    if (topoSearchTimerRef.current) clearTimeout(topoSearchTimerRef.current);
    if (searchText) {
      topoSearchTimerRef.current = setTimeout(() => {
        dispatchThunk(topographicalPlaceSearch(searchText));
      }, 300);
    }
  };

  const handleAddChip = (
    _event: React.SyntheticEvent,
    chip: TopoChip | null,
  ) => {
    if (!chip) return;
    setTopoiChips((prev) => {
      if (prev.some((tc) => tc.id === chip.id)) return prev;
      return [...prev, chip];
    });
    setTopographicPlaceFilterValue("");
  };

  const handleSearch = () => {
    setIsLoading(true);
    setResults(null);
    setVersionsMap({});

    const municipalityReference = topoiChips
      .filter((t) => t.type === "municipality")
      .map((t) => t.id);
    const countyReference = topoiChips
      .filter((t) => t.type === "county")
      .map((t) => t.id);
    const countryReference = topoiChips
      .filter((t) => t.type === "country")
      .map((t) => t.id);

    buildReportSearchQuery({
      query: searchQuery,
      stopPlaceType: stopTypeFilter,
      municipalityReference,
      countyReference,
      countryReference,
    });

    dispatchThunk(
      findStopForChangelog({
        query: searchQuery,
        stopPlaceType: stopTypeFilter,
        versionValidity: "MAX_VERSION",
        municipalityReference,
        countyReference,
        countryReference,
      }),
    )
      .then((response: any) => {
        const stops: StopPlaceResult[] = (response.data.stopPlace || [])
          .slice()
          .sort((a: StopPlaceResult, b: StopPlaceResult) => {
            const aDate = a.validBetween?.fromDate ?? "";
            const bDate = b.validBetween?.fromDate ?? "";
            return bDate.localeCompare(aDate);
          });
        setIsLoading(false);
        setResults(stops);
      })
      .catch(() => {
        setIsLoading(false);
        setResults([]);
      });
  };

  const handleToggleVersions = async (stopId: string) => {
    const existing = versionsMap[stopId];

    if (existing?.versions) {
      setVersionsMap((prev) => ({
        ...prev,
        [stopId]: { ...existing, collapsed: !existing.collapsed },
      }));
      return;
    }

    setVersionsMap((prev) => ({
      ...prev,
      [stopId]: { loading: true, versions: null, collapsed: false },
    }));

    try {
      const result: any = await dispatchThunk(getStopPlaceVersions(stopId));
      const versions: StopPlaceVersion[] = (result?.data?.versions ?? [])
        .slice()
        .sort(
          (a: StopPlaceVersion, b: StopPlaceVersion) => b.version - a.version,
        );
      setVersionsMap((prev) => ({
        ...prev,
        [stopId]: { loading: false, versions, collapsed: false },
      }));
    } catch {
      setVersionsMap((prev) => ({
        ...prev,
        [stopId]: { loading: false, versions: [], collapsed: false },
      }));
    }
  };

  const handleSaveFavorite = (title: string) => {
    const newFav: ChangelogFavorite = {
      title,
      searchQuery,
      stopTypeFilter,
      topoiChips: topoiChips.map(({ id, text, type }) => ({ id, text, type })),
    };
    setFavorites((prev) => {
      const updated = [...prev.filter((f) => f.title !== title), newFav];
      saveFavoritesToStorage(updated);
      return updated;
    });
    setFavoriteNameDialogOpen(false);
  };

  const handleLoadFavorite = (fav: ChangelogFavorite) => {
    const restoredChips: TopoChip[] = fav.topoiChips.map((c) =>
      createTopographicPlaceMenuItem(
        { id: c.id, name: { value: c.text }, topographicPlaceType: c.type },
        formatMessage,
      ),
    );
    setSearchQuery(fav.searchQuery);
    setStopTypeFilter(fav.stopTypeFilter);
    setTopoiChips(restoredChips);
  };

  const handleDeleteFavorite = (title: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.title !== title);
      saveFavoritesToStorage(updated);
      return updated;
    });
  };

  const topographicalPlacesDataSource: TopoChip[] = (topographicalPlaces ?? [])
    .filter(
      (p: any) =>
        p.topographicPlaceType === "county" ||
        p.topographicPlaceType === "municipality" ||
        p.topographicPlaceType === "country",
    )
    .filter((p: any) => !topoiChips.some((c) => c.id === p.id))
    .map((p: any) => createTopographicPlaceMenuItem(p, formatMessage));

  return {
    stopTypeFilter,
    topoiChips,
    topographicPlaceFilterValue,
    topographicalPlacesDataSource,
    searchQuery,
    isLoading,
    results,
    versionsMap,
    onApplyModalityFilters: setStopTypeFilter,
    onSearchQueryChange: setSearchQuery,
    onTopographicalPlaceSearch: handleTopographicalPlaceSearch,
    onAddChip: handleAddChip,
    onDeleteChip: (id) =>
      setTopoiChips((prev) => prev.filter((tc) => tc.id !== id)),
    onSearch: handleSearch,
    onToggleVersions: handleToggleVersions,
    favorites,
    favoriteNameDialogOpen,
    onOpenSaveDialog: () => setFavoriteNameDialogOpen(true),
    onCloseSaveDialog: () => setFavoriteNameDialogOpen(false),
    onSaveFavorite: handleSaveFavorite,
    onLoadFavorite: handleLoadFavorite,
    onDeleteFavorite: handleDeleteFavorite,
  };
};
