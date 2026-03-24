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

import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AddIcon from "@mui/icons-material/Add";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";
import {
  CopyIdButton,
  LoadingDialog,
  useNavigateToStopPlace,
} from "../../Shared";
import { ParentStopPlaceChildrenProps } from "../types";

/**
 * Collapsible children + adjacent sites sections — matches QuaysSection pattern
 */
export const ParentStopPlaceChildren: React.FC<
  ParentStopPlaceChildrenProps
> = ({
  children,
  adjacentSites,
  canEdit,
  isLoading,
  onAddChildren,
  onRemoveChild,
  onRemoveAdjacentSite,
  onAddAdjacentSite,
}) => {
  const { formatMessage } = useIntl();
  const [childrenExpanded, setChildrenExpanded] = useState(true);
  const [adjacentExpanded, setAdjacentExpanded] = useState(true);
  const { loading, loadingName, navigateTo } = useNavigateToStopPlace();

  return (
    <Box>
      <LoadingDialog
        open={loading}
        message={
          loadingName
            ? `${formatMessage({ id: "loading" })} ${loadingName}`
            : formatMessage({ id: "loading" })
        }
      />

      <Divider />

      {/* ── Children section header ── */}
      <Box
        onClick={() => setChildrenExpanded((v) => !v)}
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
        <AccountTreeIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
          {formatMessage({ id: "children" })}
        </Typography>
        <Chip label={children.length} size="small" />
        {childrenExpanded ? (
          <ExpandLessIcon fontSize="small" color="action" />
        ) : (
          <ExpandMoreIcon fontSize="small" color="action" />
        )}
        <Tooltip title={formatMessage({ id: "add_stop_place" })}>
          <span>
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onAddChildren();
              }}
              disabled={!canEdit || isLoading}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Children list */}
      <Collapse in={childrenExpanded}>
        <Divider />
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {!isLoading && children.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">
              {formatMessage({ id: "no_children" })}
            </Typography>
          </Box>
        )}
        {children.map((child) => (
          <Box
            key={child.id}
            onClick={() => navigateTo(child.id, child.name)}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Box sx={{ flexShrink: 0, mr: 1 }}>
              <ModalityIconImg
                type={child.stopPlaceType}
                submode={child.submode}
                svgStyle={{ width: 20, height: 20 }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {child.name}
              </Typography>
              {child.id && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontFamily: "monospace" }}
                  >
                    {child.id}
                  </Typography>
                  <CopyIdButton idToCopy={child.id} size="small" />
                </Box>
              )}
            </Box>
            {canEdit && (
              <Tooltip
                title={formatMessage({ id: "remove_stop_from_parent_title" })}
              >
                <span onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onRemoveChild(child.id)}
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

      {/* ── Adjacent Sites section ── */}
      {adjacentSites && adjacentSites.length > 0 && (
        <>
          <Divider />
          <Box
            onClick={() => setAdjacentExpanded((v) => !v)}
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
            {adjacentExpanded ? (
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

          <Collapse in={adjacentExpanded}>
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
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
                    >
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
      )}
    </Box>
  );
};
