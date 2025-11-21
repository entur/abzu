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
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";
import { StopPlaceLink } from "../../Shared";
import { ParentStopPlaceChildrenProps } from "../types";

/**
 * Children list component for parent stop place
 * Shows child stop places and adjacent sites
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
  const theme = useTheme();
  const { formatMessage } = useIntl();

  return (
    <Box>
      <Divider />

      {/* Children Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1.5,
          px: 2,
          bgcolor: "background.default",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {formatMessage({ id: "children" })}
        </Typography>
        <Tooltip title={formatMessage({ id: "add_stop_place" })} arrow>
          <span>
            <IconButton
              size="small"
              onClick={onAddChildren}
              disabled={!canEdit || isLoading}
              sx={{
                color: theme.palette.primary.main,
                bgcolor: theme.palette.action.hover,
                "&:hover": {
                  bgcolor: theme.palette.action.selected,
                },
                "&:disabled": {
                  bgcolor: theme.palette.action.disabledBackground,
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Divider />

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <List disablePadding>
        {children.map((child) => (
          <ListItem
            key={child.id}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", flex: 1, gap: 1 }}
            >
              <ModalityIconImg
                type={child.stopPlaceType}
                submode={child.submode}
              />
              <ListItemText
                primary={child.name}
                secondary={<StopPlaceLink id={child.id} />}
                secondaryTypographyProps={{ component: "div" }}
              />
            </Box>
            {canEdit && (
              <Tooltip
                title={formatMessage({ id: "remove_stop_from_parent_title" })}
                arrow
              >
                <span>
                  <IconButton
                    size="small"
                    onClick={() => onRemoveChild(child.id)}
                    sx={{
                      color: theme.palette.error.main,
                      "&:hover": {
                        color: theme.palette.error.dark,
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>

      {children.length === 0 && !isLoading && (
        <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="body2">
            {formatMessage({ id: "no_children" })}
          </Typography>
        </Box>
      )}

      {/* Adjacent Sites Section */}
      {adjacentSites && adjacentSites.length > 0 && (
        <>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
              px: 2,
              bgcolor: "background.default",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {formatMessage({ id: "adjacent_sites" })}
            </Typography>
            <Tooltip title={formatMessage({ id: "add_adjacent_site" })} arrow>
              <span>
                <IconButton
                  size="small"
                  onClick={onAddAdjacentSite}
                  disabled={!canEdit}
                  sx={{
                    color: theme.palette.primary.main,
                    bgcolor: theme.palette.action.hover,
                    "&:hover": {
                      bgcolor: theme.palette.action.selected,
                    },
                  }}
                >
                  <AddIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Divider />
          <List disablePadding>
            {adjacentSites.map((site) => (
              <ListItem
                key={site.ref}
                sx={{
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemText primary={site.name} secondary={site.id} />
                {canEdit && (
                  <Tooltip title={formatMessage({ id: "remove" })} arrow>
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => onRemoveAdjacentSite(site.id, site.ref)}
                        sx={{
                          color: theme.palette.error.main,
                          "&:hover": {
                            color: theme.palette.error.dark,
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};
