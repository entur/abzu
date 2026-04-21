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

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alpha, Box, Collapse, IconButton } from "@mui/material";
import { useIntl } from "react-intl";
import { ColumnTransformerStopPlaceJsx } from "../../../../models/columnTransformers";
import { ColumnOption, DuplicateInfo, ReportResult } from "../types";
import { ReportQuayRows } from "./ReportQuayRows";

interface ReportResultRowProps {
  item: ReportResult;
  index: number;
  columns: string[];
  quayColumnOptions: ColumnOption[];
  duplicateInfo: DuplicateInfo;
  expanded: boolean;
  onExpandToggle: (id: string) => void;
}

const cellSx = {
  flexBasis: "100%",
  textAlign: "left" as const,
  mb: 0.5,
  mt: 0.5,
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontSize: 12,
};

export const ReportResultRow: React.FC<ReportResultRowProps> = ({
  item,
  index,
  columns,
  quayColumnOptions,
  duplicateInfo,
  expanded,
  onExpandToggle,
}) => {
  const { formatMessage } = useIntl();

  const hasQuays = item.quays && item.quays.length > 0;
  const containsError =
    duplicateInfo.stopPlacesWithConflict?.includes(item.id) ?? false;

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        sx={(theme) => ({
          background: containsError
            ? theme.palette.error.light
            : index % 2
              ? alpha(theme.palette.primary.light, 0.18)
              : theme.palette.background.paper,
          border: containsError
            ? `1px solid ${theme.palette.error.main}`
            : "none",
          px: 1.25,
        })}
      >
        {columns.map((column) => (
          <Box key={"cell-" + column} sx={cellSx}>
            {(ColumnTransformerStopPlaceJsx as any)[column]?.(
              item,
              formatMessage,
            )}
          </Box>
        ))}
        <Box sx={{ ...cellSx, flexBasis: "auto", flexShrink: 0 }}>
          {hasQuays && (
            <IconButton size="small" onClick={() => onExpandToggle(item.id)}>
              {expanded ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )}
            </IconButton>
          )}
        </Box>
      </Box>
      {hasQuays && (
        <Collapse in={expanded} unmountOnExit>
          <Box sx={{ ml: 2, borderLeft: "2px solid", borderColor: "divider" }}>
            <ReportQuayRows
              quays={item.quays}
              columnOptions={quayColumnOptions}
              duplicateInfo={duplicateInfo}
            />
          </Box>
        </Collapse>
      )}
    </Box>
  );
};
