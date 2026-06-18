/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import { Box, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { ColumnOption, DuplicateInfo, ReportResult } from "../types";
import { ReportResultRow } from "./ReportResultRow";

const PAGE_SIZE = 20;

interface ReportResultsTableProps {
  results: ReportResult[];
  activePageIndex: number;
  stopColumnOptions: ColumnOption[];
  quayColumnOptions: ColumnOption[];
  duplicateInfo: DuplicateInfo;
  expandedRows: Set<string>;
  onExpandToggle: (id: string) => void;
}

export const ReportResultsTable: React.FC<ReportResultsTableProps> = ({
  results,
  activePageIndex,
  stopColumnOptions,
  quayColumnOptions,
  duplicateInfo,
  expandedRows,
  onExpandToggle,
}) => {
  const { formatMessage } = useIntl();

  const columns = stopColumnOptions.filter((c) => c.checked).map((c) => c.id);

  const paginatedResults = (() => {
    if (!results.length) return [];
    const map: ReportResult[][] = [];
    for (let i = 0, j = results.length; i < j; i += PAGE_SIZE) {
      map.push(results.slice(i, i + PAGE_SIZE));
    }
    return map;
  })();

  const pageItems = paginatedResults[activePageIndex] || [];
  const pageSize = Math.min(results.length, PAGE_SIZE);

  const showingLabel = formatMessage({ id: "showing_results" })
    .replace("$size", String(pageSize))
    .replace("$total", String(results.length));

  const cellSx = {
    flexBasis: "100%",
    textAlign: "left" as const,
    mb: 0.5,
    mt: 0.5,
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 12,
  };

  return (
    <Box pb={8} sx={{ overflowX: "auto" }}>
      <Typography
        variant="caption"
        fontWeight={600}
        display="block"
        textAlign="center"
        mb={1}
      >
        {showingLabel}
      </Typography>

      <Box sx={{ minWidth: 600 }}>
        {/* Header row */}
        <Box display="flex" fontWeight={600} pl={1.25}>
          {columns.map((column) => (
            <Box key={"header-" + column} sx={cellSx}>
              <Typography variant="caption" fontWeight={600}>
                {formatMessage({ id: `report_columnNames_${column}` })}
              </Typography>
            </Box>
          ))}
          {/* spacer for expand button */}
          <Box
            sx={{ ...cellSx, flexBasis: "auto", flexShrink: 0, width: 40 }}
          />
        </Box>

        {/* Data rows */}
        {pageItems.map((item, index) => (
          <ReportResultRow
            key={item.id}
            item={item}
            index={index}
            columns={columns}
            quayColumnOptions={quayColumnOptions}
            duplicateInfo={duplicateInfo}
            expanded={expandedRows.has(item.id)}
            onExpandToggle={onExpandToggle}
          />
        ))}
      </Box>
    </Box>
  );
};
