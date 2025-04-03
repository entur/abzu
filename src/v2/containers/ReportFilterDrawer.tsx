import CloseIcon from "@mui/icons-material/Close";
import MdSearch from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import React from "react";
import ModalityFilter from "../../components/EditStopPage/ModalityFilter";
import TopographicalFilter from "../../components/MainPage/TopographicalFilter";
import AdvancedReportFilters from "../../components/ReportPage/AdvancedReportFilters";
import GeneralReportFilters from "../../components/ReportPage/GeneralReportFilters";
import ReportFilterBox from "../../components/ReportPage/ReportFilterBox";
import TagFilterTray from "../../components/ReportPage/TagFilterTray";
import MdSpinner from "../../static/icons/spinner";

interface ReportFilterDrawerProps {
  onClose: () => void;
  formatMessage: any;
  locale: string;
  stopTypeFilter: string[];
  handleApplyModalityFilters: (filters: any[]) => void;
  topoiChips: any[];
  handleDeleteChip: (chipId: string) => void;
  tags: string[];
  handleItemOnCheck: (name: string, checked: boolean) => void;
  handleOnKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSearchQueryChange: (query: string) => void;
  isLoading: boolean;
  handleSearch: () => void;
  handleFilterChange: (key: string, value: any) => void;
  withoutLocationOnly: boolean;
  withDuplicateImportedIds: boolean;
  withNearbySimilarDuplicates: boolean;
  showFutureAndExpired: boolean;
  withTags: boolean;
}

const ReportFilterDrawer: React.FC<ReportFilterDrawerProps> = ({
  onClose,
  formatMessage,
  locale,
  stopTypeFilter,
  handleApplyModalityFilters,
  topoiChips,
  handleDeleteChip,
  tags,
  handleItemOnCheck,
  handleOnKeyDown,
  handleSearchQueryChange,
  isLoading,
  handleSearch,
  handleFilterChange,
  withoutLocationOnly,
  withDuplicateImportedIds,
  withNearbySimilarDuplicates,
  showFutureAndExpired,
  withTags,
}) => {
  return (
    <div style={{ width: 300, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      {/* Filter Components */}
      <div style={{ marginTop: 10 }}>
        <ReportFilterBox>
          <div
            style={{
              fontWeight: 600,
              marginBottom: 5,
              fontSize: 12,
              padding: 5,
            }}
          >
            {formatMessage({ id: "filter_report_by_modality" })}
          </div>
          <ModalityFilter
            locale={locale}
            stopTypeFilter={stopTypeFilter}
            handleApplyFilters={handleApplyModalityFilters}
          />
          <div style={{ padding: 5 }}>
            <div style={{ fontWeight: 600, marginBottom: 5, fontSize: 12 }}>
              {formatMessage({ id: "filter_report_by_topography" })}
            </div>
            <TopographicalFilter
              topoiChips={topoiChips}
              handleDeleteChip={handleDeleteChip}
            />
          </div>
        </ReportFilterBox>
        <ReportFilterBox style={{ marginTop: 20 }}>
          <div style={{ marginLeft: 5, paddingTop: 5 }}>
            <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 10 }}>
              {formatMessage({ id: "filter_by_tags" })}
            </div>
            <TagFilterTray
              tags={tags}
              formatMessage={formatMessage}
              handleItemOnCheck={handleItemOnCheck}
            />
          </div>
          <div
            style={{
              marginLeft: 10,
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              variant="standard"
              type="search"
              label={formatMessage({ id: "optional_search_string" })}
              style={{ width: "100%" }}
              onKeyDown={handleOnKeyDown}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
            />
            <div style={{ marginTop: 10 }}>
              <Button
                variant="outlined"
                disabled={isLoading}
                startIcon={isLoading ? <MdSpinner /> : <MdSearch />}
                onClick={handleSearch}
              >
                {formatMessage({ id: "search" })}
              </Button>
            </div>
            <div style={{ marginTop: 10, width: "100%" }}>
              <GeneralReportFilters
                formatMessage={formatMessage}
                hasParking={false}
                handleCheckboxChange={handleFilterChange}
              />
              <AdvancedReportFilters
                formatMessage={formatMessage}
                withoutLocationOnly={withoutLocationOnly}
                withDuplicateImportedIds={withDuplicateImportedIds}
                withNearbySimilarDuplicates={withNearbySimilarDuplicates}
                showFutureAndExpired={showFutureAndExpired}
                withTags={withTags}
                handleCheckboxChange={handleFilterChange}
              />
            </div>
          </div>
        </ReportFilterBox>
      </div>
    </div>
  );
};

export default ReportFilterDrawer;
