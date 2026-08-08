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
import { addItemButtonSx } from "../../Shared";
import { AdjacentSite } from "../types";
import { AdjacentSiteItem } from "./AdjacentSiteItem";

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
  const [expanded, setExpanded] = useState(false);

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
              onClick={(e) => {
                e.stopPropagation();
                onAddAdjacentSite();
              }}
              disabled={!canEdit}
              sx={addItemButtonSx("primary.main")}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Collapse in={expanded}>
        <Divider />
        {adjacentSites.map((site) => (
          <AdjacentSiteItem
            key={site.ref}
            site={site}
            onNavigate={navigateTo}
            onRemove={canEdit ? onRemoveAdjacentSite : undefined}
          />
        ))}
      </Collapse>
    </>
  );
};
