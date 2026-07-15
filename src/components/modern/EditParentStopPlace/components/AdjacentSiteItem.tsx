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

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { CopyIdButton } from "../../Shared";
import { AdjacentSiteListItemProps } from "../types";

/**
 * Adjacent site row — matches QuayItem row style. Clicking the row navigates
 * to the adjacent stop place (a different entity), unlike quay/parking rows
 * which focus in place.
 */
export const AdjacentSiteItem: React.FC<AdjacentSiteListItemProps> = ({
  site,
  onNavigate,
  onRemove,
  disabled = false,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box
      onClick={() => site.id && onNavigate(site.id, site.name)}
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        cursor: site.id ? "pointer" : "default",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {site.name}
        </Typography>
        {site.id && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ fontFamily: "monospace" }}
            >
              {site.id}
            </Typography>
            <CopyIdButton idToCopy={site.id} size="small" />
          </Box>
        )}
      </Box>
      {onRemove && (
        <Tooltip title={formatMessage({ id: "remove" })}>
          <span onClick={(e) => e.stopPropagation()}>
            <IconButton
              size="small"
              color="error"
              disabled={disabled}
              onClick={() => onRemove(site.id, site.ref)}
              sx={{ ml: 0.5 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}

      <ChevronRightIcon fontSize="small" color="action" />
    </Box>
  );
};
