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

import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import InfoIcon from "@mui/icons-material/Info";
import PlaceIcon from "@mui/icons-material/Place";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import { Box, Slide, useTheme } from "@mui/material";
import { useMemo } from "react";
import { IntlShape } from "react-intl";
import { Entities } from "../../../../models/Entities";
import { MinimizedBar, MinimizedBarAction } from "../../Shared";

interface GroupOfStopPlacesMinimizedBarProps {
  groupOfStopPlaces: any;
  originalGOS: any;
  isOpen: boolean;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isMobile: boolean;
  drawerWidth: string | number;
  formatMessage: IntlShape["formatMessage"];
  onExpand: () => void;
  onClose: () => void;
  onOpenInfo: () => void;
  onOpenNameDescription: () => void;
  onOpenStopPlaces: () => void;
  onOpenDelete: () => void;
  onOpenUndo: () => void;
  onOpenSave: () => void;
}

/**
 * Minimized bar for group of stop places editor
 * Handles configuration and rendering of minimized bar actions
 */
export const GroupOfStopPlacesMinimizedBar: React.FC<
  GroupOfStopPlacesMinimizedBarProps
> = ({
  groupOfStopPlaces,
  originalGOS,
  isOpen,
  isModified,
  canEdit,
  canDelete,
  isMobile,
  drawerWidth,
  formatMessage,
  onExpand,
  onClose,
  onOpenInfo,
  onOpenNameDescription,
  onOpenStopPlaces,
  onOpenDelete,
  onOpenUndo,
  onOpenSave,
}) => {
  const theme = useTheme();

  // Define minimized bar actions
  const minimizedBarActions: MinimizedBarAction[] = useMemo(
    () => [
      {
        id: "info",
        icon: <InfoIcon fontSize="small" />,
        label: formatMessage({ id: "information" }),
        onClick: onOpenInfo,
        tooltip: formatMessage({ id: "information" }),
      },
      {
        id: "name-description",
        icon: <DescriptionIcon fontSize="small" />,
        label: formatMessage({ id: "edit_name_and_description" }),
        onClick: onOpenNameDescription,
        tooltip: formatMessage({ id: "edit_name_and_description" }),
      },
      {
        id: "stop-places",
        icon: <PlaceIcon fontSize="small" />,
        label: formatMessage({ id: "manage_stop_places" }),
        onClick: onOpenStopPlaces,
        tooltip: formatMessage({ id: "manage_stop_places" }),
      },
      ...(canEdit && groupOfStopPlaces.id
        ? [
            {
              id: "remove",
              icon: <DeleteIcon fontSize="small" />,
              label: formatMessage({ id: "remove" }),
              onClick: onOpenDelete,
              disabled: !canDelete,
              color: "error" as const,
              tooltip: formatMessage({ id: "remove" }),
            },
          ]
        : []),
      ...(canEdit
        ? [
            {
              id: "undo",
              icon: <UndoIcon fontSize="small" />,
              label: formatMessage({ id: "undo_changes" }),
              onClick: onOpenUndo,
              disabled: !isModified,
              tooltip: formatMessage({ id: "undo_changes" }),
            },
            {
              id: "save",
              icon: <SaveIcon fontSize="small" />,
              label: formatMessage({ id: "save" }),
              onClick: onOpenSave,
              disabled: !isModified || !groupOfStopPlaces.name,
              color: "primary" as const,
              tooltip: formatMessage({ id: "save" }),
            },
          ]
        : []),
    ],
    [
      formatMessage,
      canEdit,
      canDelete,
      isModified,
      groupOfStopPlaces.id,
      groupOfStopPlaces.name,
      onOpenInfo,
      onOpenNameDescription,
      onOpenStopPlaces,
      onOpenDelete,
      onOpenUndo,
      onOpenSave,
    ],
  );

  if (isOpen) return null;

  return (
    <>
      {isMobile ? (
        <Slide direction="up" in={!isOpen} mountOnEnter unmountOnExit>
          <Box>
            <MinimizedBar
              icon={<GroupWorkIcon />}
              name={
                originalGOS.id
                  ? originalGOS.name ||
                    formatMessage({ id: "group_of_stop_places" })
                  : formatMessage({ id: "you_are_creating_group" })
              }
              id={originalGOS.id}
              entityType={Entities.GROUP_OF_STOP_PLACE}
              hasId={!!groupOfStopPlaces.id}
              actions={minimizedBarActions}
              onExpand={onExpand}
              onClose={onClose}
              isMobile={true}
            />
          </Box>
        </Slide>
      ) : (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            top: 64,
            width: drawerWidth,
            zIndex: theme.zIndex.drawer,
          }}
        >
          <MinimizedBar
            icon={<GroupWorkIcon />}
            name={
              originalGOS.id
                ? originalGOS.name ||
                  formatMessage({ id: "group_of_stop_places" })
                : formatMessage({ id: "you_are_creating_group" })
            }
            id={originalGOS.id}
            entityType={Entities.GROUP_OF_STOP_PLACE}
            hasId={!!groupOfStopPlaces.id}
            actions={minimizedBarActions}
            onExpand={onExpand}
            onClose={onClose}
            isMobile={false}
          />
        </Box>
      )}
    </>
  );
};
