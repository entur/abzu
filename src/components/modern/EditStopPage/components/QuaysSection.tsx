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
import TrainIcon from "@mui/icons-material/DirectionsBus";
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
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Quay, QuaysSectionProps } from "../types";
import { QuayItem } from "./QuayItem";

/**
 * Section header + collapsible list of navigable quay rows.
 * Collapsed by default.
 */
export const QuaysSection: React.FC<QuaysSectionProps> = ({
  quays,
  canEdit,
  onDeleteQuay,
  onNavigateToQuay,
  onAddQuay,
}) => {
  const { formatMessage } = useIntl();
  const [expanded, setExpanded] = useState(false);

  return (
    <Box>
      <Divider />
      {/* Section header — click to toggle */}
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
        <TrainIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
          {formatMessage({ id: "quays" })}
        </Typography>
        <Chip label={quays.length} size="small" />
        {expanded ? (
          <ExpandLessIcon fontSize="small" color="action" />
        ) : (
          <ExpandMoreIcon fontSize="small" color="action" />
        )}
        <Tooltip title={formatMessage({ id: "new_quay" })}>
          <span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onAddQuay();
              }}
              disabled={!canEdit}
              color="primary"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Collapsible quay list */}
      <Collapse in={expanded}>
        <Divider />
        {quays.map((quay: Quay, index: number) => (
          <QuayItem
            key={quay.id || `quay-${index}`}
            quay={quay}
            index={index}
            canEdit={canEdit}
            onDelete={() => onDeleteQuay(index)}
            onNavigate={() => onNavigateToQuay(index)}
          />
        ))}
      </Collapse>
    </Box>
  );
};
