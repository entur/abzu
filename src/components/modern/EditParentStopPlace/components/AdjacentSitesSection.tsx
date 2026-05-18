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

import AddIcon from "@mui/icons-material/Add";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { CopyIdButton } from "../../Shared";
import { AdjacentSite } from "../types";

interface AdjacentSitesSectionProps {
  adjacentSites: AdjacentSite[];
  canEdit: boolean;
  onRemoveAdjacentSite: (stopPlaceId: string, adjacentRef: string) => void;
  onAddAdjacentSite: () => void;
  navigateTo: (id: string, name: string) => void;
}

export const AdjacentSitesSection: React.FC<AdjacentSitesSectionProps> = ({
  adjacentSites,
  canEdit,
  onRemoveAdjacentSite,
  onAddAdjacentSite,
  navigateTo,
}) => {
  const { formatMessage } = useIntl();
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <Divider />
      <Box
        onClick={() => setExpanded((v) => !v)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: "background.default",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <CompareArrowsIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
          {formatMessage({ id: "adjacent_sites" })}
        </Typography>
        <Chip label={adjacentSites.length} size="small" />
        {expanded ? (
          <ExpandLessIcon fontSize="small" color="action" />
        ) : (
          <ExpandMoreIcon fontSize="small" color="action" />
        )}
        <Tooltip title={formatMessage({ id: "add_adjacent_site" })}>
          <span>
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onAddAdjacentSite();
              }}
              disabled={!canEdit}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Collapse in={expanded}>
        <Divider />
        {adjacentSites.map((site) => (
          <Box
            key={site.ref}
            onClick={() => site.id && navigateTo(site.id, site.name)}
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
            {canEdit && (
              <Tooltip title={formatMessage({ id: "remove" })}>
                <span onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onRemoveAdjacentSite(site.id, site.ref)}
                    sx={{ ml: 0.5 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Box>
        ))}
      </Collapse>
    </>
  );
};
