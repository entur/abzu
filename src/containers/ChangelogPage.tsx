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

import Typography from "@mui/material/Typography";
import { useIntl } from "react-intl";
import { ChangelogFilterPanel } from "../components/ChangelogPage/ChangelogFilterPanel";
import { ChangelogResultsTable } from "../components/ChangelogPage/ChangelogResultsTable";
import { SaveFilterDialog } from "../components/ChangelogPage/SaveFilterDialog";
import { useChangelog } from "../components/ChangelogPage/hooks/useChangelog";

const ChangelogPage = () => {
  const { formatMessage } = useIntl();
  const {
    stopTypeFilter,
    topoiChips,
    topographicPlaceFilterValue,
    topographicalPlacesDataSource,
    searchQuery,
    isLoading,
    results,
    versionsMap,
    onApplyModalityFilters,
    onSearchQueryChange,
    onTopographicalPlaceSearch,
    onAddChip,
    onDeleteChip,
    onSearch,
    onToggleVersions,
    favorites,
    favoriteNameDialogOpen,
    onOpenSaveDialog,
    onCloseSaveDialog,
    onSaveFavorite,
    onLoadFavorite,
    onDeleteFavorite,
  } = useChangelog();

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        {formatMessage({ id: "changelog" })}
      </Typography>

      <ChangelogFilterPanel
        stopTypeFilter={stopTypeFilter}
        topoiChips={topoiChips}
        topographicPlaceFilterValue={topographicPlaceFilterValue}
        topographicalPlacesDataSource={topographicalPlacesDataSource}
        searchQuery={searchQuery}
        isLoading={isLoading}
        onApplyModalityFilters={onApplyModalityFilters}
        onSearchQueryChange={onSearchQueryChange}
        onTopographicalPlaceSearch={onTopographicalPlaceSearch}
        onAddChip={onAddChip}
        onDeleteChip={onDeleteChip}
        onSearch={onSearch}
        onOpenSaveDialog={onOpenSaveDialog}
        favorites={favorites}
        onLoadFavorite={onLoadFavorite}
        onDeleteFavorite={onDeleteFavorite}
      />

      <ChangelogResultsTable
        results={results}
        versionsMap={versionsMap}
        isLoading={isLoading}
        onToggleVersions={onToggleVersions}
      />

      <SaveFilterDialog
        open={favoriteNameDialogOpen}
        onClose={onCloseSaveDialog}
        onConfirm={onSaveFavorite}
      />
    </div>
  );
};

export default ChangelogPage;
