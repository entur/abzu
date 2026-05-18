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

import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { ReportResult } from "../types";

const PAGE_SIZE = 20;

interface ReportFooterProps {
  results: ReportResult[];
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  onExportStopPlaces: () => void;
  onExportQuays: () => void;
}

export const ReportFooter: React.FC<ReportFooterProps> = ({
  results,
  activePageIndex,
  onSelectPage,
  onExportStopPlaces,
  onExportQuays,
}) => {
  const { formatMessage } = useIntl();
  const [exportAnchorEl, setExportAnchorEl] = useState<HTMLElement | null>(
    null,
  );

  const totalCount = results.length;
  const pageCount = Math.ceil(totalCount / PAGE_SIZE);
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "primary.dark",
        px: 2,
        py: 1,
        flexShrink: 0,
        minHeight: 48,
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" color="primary.contrastText">
          {formatMessage({ id: "page" })}:
        </Typography>
        {pages.map((page) => (
          <Box
            key={"page-" + page}
            onClick={() => onSelectPage(page)}
            sx={(theme) => ({
              color: theme.palette.primary.contrastText,
              cursor: "pointer",
              fontSize: 14,
              px: 0.5,
              fontWeight: activePageIndex === page ? 700 : 400,
              borderBottom:
                activePageIndex === page
                  ? `1px solid ${theme.palette.info.light}`
                  : "none",
            })}
          >
            {page + 1}
          </Box>
        ))}
      </Box>

      <Box>
        <Button
          variant="contained"
          disabled={!totalCount}
          onClick={(e) => setExportAnchorEl(e.currentTarget)}
        >
          {formatMessage({ id: "export_to_csv" })}
        </Button>
        <Menu
          open={Boolean(exportAnchorEl)}
          anchorEl={exportAnchorEl}
          onClose={() => setExportAnchorEl(null)}
          anchorOrigin={{ horizontal: "left", vertical: "top" }}
          transformOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              onExportStopPlaces();
              setExportAnchorEl(null);
            }}
          >
            {formatMessage({ id: "export_to_csv_stop_places" })}
          </MenuItem>
          <MenuItem
            onClick={() => {
              onExportQuays();
              setExportAnchorEl(null);
            }}
          >
            {formatMessage({ id: "export_to_csv_quays" })}
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};
