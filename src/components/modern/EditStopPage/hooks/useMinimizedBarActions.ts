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

import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import HistoryIcon from "@mui/icons-material/History";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LabelIcon from "@mui/icons-material/Label";
import SaveIcon from "@mui/icons-material/Save";
import ShortTextIcon from "@mui/icons-material/ShortText";
import UndoIcon from "@mui/icons-material/Undo";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import React from "react";
import { useIntl } from "react-intl";
import { MinimizedBarAction } from "../../Shared";
import { StopPlace } from "../types";

interface UseMinimizedBarActionsParams {
  stopPlace: StopPlace;
  versions: any[];
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onOpenInfoDialog: () => void;
  onOpenNameDescriptionDialog: () => void;
  onOpenTagsDialog: () => void;
  onOpenAltNamesDialog: () => void;
  onOpenKeyValuesDialog: () => void;
  onOpenVersionsDialog: () => void;
  onOpenTerminateDialog: () => void;
  onOpenUndoDialog: () => void;
  onOpenSaveDialog: () => void;
}

/**
 * Builds the MinimizedBarAction[] for the stop place editor toolbar.
 * Extracted to keep EditStopPage lean; the array is config-like and deserves its own home.
 */
export const useMinimizedBarActions = ({
  stopPlace,
  versions,
  isModified,
  canEdit,
  canDelete,
  onOpenInfoDialog,
  onOpenNameDescriptionDialog,
  onOpenTagsDialog,
  onOpenAltNamesDialog,
  onOpenKeyValuesDialog,
  onOpenVersionsDialog,
  onOpenTerminateDialog,
  onOpenUndoDialog,
  onOpenSaveDialog,
}: UseMinimizedBarActionsParams): MinimizedBarAction[] => {
  const { formatMessage } = useIntl();

  const baseActions: MinimizedBarAction[] = [
    {
      id: "info",
      icon: React.createElement(InfoOutlinedIcon, { fontSize: "small" }),
      label: formatMessage({ id: "information" }),
      onClick: onOpenInfoDialog,
      tooltip: formatMessage({ id: "information" }),
    },
    {
      id: "name-description",
      icon: React.createElement(DescriptionIcon, { fontSize: "small" }),
      label: formatMessage({ id: "edit_name_and_description" }),
      onClick: onOpenNameDescriptionDialog,
      tooltip: formatMessage({ id: "edit_name_and_description" }),
    },
    {
      id: "tags",
      icon: React.createElement(LabelIcon, { fontSize: "small" }),
      label: formatMessage({ id: "tags" }),
      onClick: onOpenTagsDialog,
      tooltip: formatMessage({ id: "tags" }),
    },
    {
      id: "alt-names",
      icon: React.createElement(ShortTextIcon, { fontSize: "small" }),
      label: formatMessage({ id: "alternative_names" }),
      onClick: onOpenAltNamesDialog,
      tooltip: formatMessage({ id: "alternative_names" }),
    },
    {
      id: "key-values",
      icon: React.createElement(VpnKeyIcon, { fontSize: "small" }),
      label: formatMessage({ id: "key_values_hint" }),
      onClick: onOpenKeyValuesDialog,
      tooltip: formatMessage({ id: "key_values_hint" }),
    },
    {
      id: "versions",
      icon: React.createElement(HistoryIcon, { fontSize: "small" }),
      label: formatMessage({ id: "versions" }),
      onClick: onOpenVersionsDialog,
      tooltip: `${formatMessage({ id: "versions" })}${versions.length > 0 ? ` (${versions.length})` : ""}`,
    },
  ];

  const terminateAction: MinimizedBarAction[] = stopPlace.id
    ? [
        {
          id: "terminate",
          icon: React.createElement(DeleteIcon, { fontSize: "small" }),
          label: formatMessage({
            id: stopPlace.hasExpired
              ? "delete_stop_place"
              : "terminate_stop_place",
          }),
          onClick: onOpenTerminateDialog,
          disabled: !canDelete && !stopPlace.hasExpired,
          color: "error" as const,
          group: "action" as const,
          tooltip: formatMessage({
            id: stopPlace.hasExpired
              ? "delete_stop_place"
              : "terminate_stop_place",
          }),
        },
      ]
    : [];

  const editActions: MinimizedBarAction[] = canEdit
    ? [
        {
          id: "undo",
          icon: React.createElement(UndoIcon, { fontSize: "small" }),
          label: formatMessage({ id: "undo_changes" }),
          onClick: onOpenUndoDialog,
          disabled: !isModified,
          group: "action" as const,
          tooltip: formatMessage({ id: "undo_changes" }),
        },
        {
          id: "save",
          icon: React.createElement(SaveIcon, { fontSize: "small" }),
          label: formatMessage({ id: "save" }),
          onClick: onOpenSaveDialog,
          disabled: !isModified || !stopPlace.name,
          color: "primary" as const,
          group: "action" as const,
          tooltip: formatMessage({ id: "save" }),
        },
      ]
    : [];

  return [...baseActions, ...terminateAction, ...editActions];
};
