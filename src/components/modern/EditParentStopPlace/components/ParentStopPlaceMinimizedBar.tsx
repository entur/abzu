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
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import LabelIcon from "@mui/icons-material/Label";
import Link from "@mui/icons-material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SaveIcon from "@mui/icons-material/Save";
import ShortTextIcon from "@mui/icons-material/ShortText";
import UndoIcon from "@mui/icons-material/Undo";
import { Box, Slide, useTheme } from "@mui/material";
import { useMemo } from "react";
import { IntlShape } from "react-intl";
import { Entities } from "../../../../models/Entities";
import { MinimizedBar, MinimizedBarAction } from "../../Shared";

interface ParentStopPlaceMinimizedBarProps {
  stopPlace: any;
  originalStopPlace: any;
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
  onOpenChildren: () => void;
  onOpenAltNames: () => void;
  onOpenTags: () => void;
  onOpenCoordinates: () => void;
  onOpenTerminate: () => void;
  onOpenUndo: () => void;
  onOpenSave: () => void;
}

/**
 * Minimized bar for parent stop place editor
 * Handles configuration and rendering of minimized bar actions
 */
export const ParentStopPlaceMinimizedBar: React.FC<
  ParentStopPlaceMinimizedBarProps
> = ({
  stopPlace,
  originalStopPlace,
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
  onOpenChildren,
  onOpenAltNames,
  onOpenTags,
  onOpenCoordinates,
  onOpenTerminate,
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
        id: "children",
        icon: <AccountTreeIcon fontSize="small" />,
        label: formatMessage({ id: "children" }),
        onClick: onOpenChildren,
        tooltip: formatMessage({ id: "children" }),
      },
      {
        id: "alt-names",
        icon: <ShortTextIcon fontSize="small" />,
        label: formatMessage({ id: "alternative_names" }),
        onClick: onOpenAltNames,
        tooltip: formatMessage({ id: "alternative_names" }),
      },
      {
        id: "tags",
        icon: <LabelIcon fontSize="small" />,
        label: formatMessage({ id: "tags" }),
        onClick: onOpenTags,
        tooltip: formatMessage({ id: "tags" }),
      },
      {
        id: "coordinates",
        icon: <LocationOnIcon fontSize="small" />,
        label: formatMessage({ id: "coordinates" }),
        onClick: onOpenCoordinates,
        tooltip: formatMessage({ id: "coordinates" }),
      },
      ...(stopPlace?.id
        ? [
            {
              id: "terminate",
              icon: <DeleteIcon fontSize="small" />,
              label: formatMessage({
                id: stopPlace?.hasExpired
                  ? "delete_stop_place"
                  : "terminate_stop_place",
              }),
              onClick: onOpenTerminate,
              disabled: !canDelete && !stopPlace?.hasExpired,
              color: "error" as const,
              tooltip: formatMessage({
                id: stopPlace?.hasExpired
                  ? "delete_stop_place"
                  : "terminate_stop_place",
              }),
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
              disabled: !isModified || !stopPlace?.name,
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
      stopPlace?.id,
      stopPlace?.name,
      stopPlace?.hasExpired,
      onOpenInfo,
      onOpenNameDescription,
      onOpenChildren,
      onOpenAltNames,
      onOpenTags,
      onOpenCoordinates,
      onOpenTerminate,
      onOpenUndo,
      onOpenSave,
    ],
  );

  if (isOpen || !originalStopPlace) return null;

  return (
    <>
      {isMobile ? (
        <Slide direction="up" in={!isOpen} mountOnEnter unmountOnExit>
          <Box>
            <MinimizedBar
              icon={<Link />}
              name={
                stopPlace?.id
                  ? originalStopPlace.name ||
                    formatMessage({ id: "parentStopPlace" })
                  : formatMessage({ id: "new_stop_title" })
              }
              id={originalStopPlace.id}
              entityType={Entities.STOP_PLACE}
              hasId={!!stopPlace?.id}
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
            icon={<Link />}
            name={
              stopPlace?.id
                ? originalStopPlace.name ||
                  formatMessage({ id: "parentStopPlace" })
                : formatMessage({ id: "new_stop_title" })
            }
            id={originalStopPlace.id}
            entityType={Entities.STOP_PLACE}
            hasId={!!stopPlace?.id}
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
