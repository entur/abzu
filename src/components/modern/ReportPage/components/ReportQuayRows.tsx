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
import { ColumnTransformerQuaysJsx } from "../../../../models/columnTransformers";
import { ColumnOption, DuplicateInfo, ReportQuay } from "../types";

interface ReportQuayRowsProps {
  quays: ReportQuay[];
  columnOptions: ColumnOption[];
  duplicateInfo: DuplicateInfo;
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

export const ReportQuayRows: React.FC<ReportQuayRowsProps> = ({
  quays,
  columnOptions,
  duplicateInfo,
}) => {
  const { formatMessage } = useIntl();

  if (!quays.length) return null;

  const columns = columnOptions.filter((c) => c.checked).map((c) => c.id);

  return (
    <Box>
      <Box display="flex" fontWeight={600} pl={1.25}>
        {columns.map((column) => (
          <Box key={"quay-col-" + column} sx={cellSx}>
            <Typography variant="caption" fontWeight={600}>
              {formatMessage({ id: `report_columnNames_${column}` })}
            </Typography>
          </Box>
        ))}
      </Box>
      {quays.map((quay) => (
        <Box
          key={"quay-" + quay.id}
          display="flex"
          sx={{
            px: 1.25,
            border: "1px dotted grey",
          }}
        >
          {columns.map((column) => (
            <Box key={"quay-cell-" + column} sx={cellSx}>
              {(ColumnTransformerQuaysJsx as any)[column]?.(
                quay,
                duplicateInfo,
                formatMessage,
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
