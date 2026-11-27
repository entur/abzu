/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Chip, Tooltip, Typography } from "@mui/material";
import React from "react";

const TOGGLE_KEYS = ["Enter", " "];

interface SectionAction {
  /** Visible text, e.g. "Koble til": attaching isn't creating (F-33). */
  label: string;
  /** Longer explanation in the tooltip. */
  tooltip: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface CollapsibleSectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
  action?: SectionAction;
}

/**
 * The header of a collapsible list in the editors (F-33):
 * `[icon] Title (n) [action] ………… chevron`. The chevron is always last, as in
 * most accordions, and the whole header toggles the list by mouse or keyboard.
 * An action sits next to the title with a visible label, so it can't be taken
 * for the expander and screen readers can name it (F-34).
 */
export const CollapsibleSectionHeader = ({
  icon,
  title,
  count,
  expanded,
  onToggle,
  action,
}: CollapsibleSectionHeaderProps) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.target !== event.currentTarget) return;
    if (!TOGGLE_KEYS.includes(event.key)) return;
    event.preventDefault();
    onToggle();
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.5,
        bgcolor: "background.default",
        cursor: "pointer",
        userSelect: "none",
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: -2,
        },
      }}
    >
      {icon}
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Chip label={count} size="small" />
      {action && (
        <Tooltip title={action.tooltip}>
          <span onClick={(event) => event.stopPropagation()}>
            <Button
              size="small"
              variant="outlined"
              startIcon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
              sx={{ ml: 0.5, py: 0, textTransform: "none" }}
            >
              {action.label}
            </Button>
          </span>
        </Tooltip>
      )}
      <Box sx={{ flex: 1 }} />
      {expanded ? (
        <ExpandLessIcon fontSize="small" color="action" />
      ) : (
        <ExpandMoreIcon fontSize="small" color="action" />
      )}
    </Box>
  );
};
