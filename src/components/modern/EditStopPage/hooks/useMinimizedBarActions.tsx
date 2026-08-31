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
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import { useIntl } from "react-intl";
import { MinimizedBarAction } from "../../Shared";
import { DirtyBadge } from "../../Shared/ElementStatus";
import { STOP_PLACE_TABS } from "../stopPlaceTabs";
import { StopPlace } from "../types";
import { useStopPlaceTabDirty } from "./useStopPlaceTabDirty";

interface UseMinimizedBarActionsParams {
  stopPlace: StopPlace;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;
  /** Expands the panel and selects the given tab. */
  onOpenTab: (tabIndex: number) => void;
  onOpenTerminateDialog: () => void;
  onOpenUndoDialog: () => void;
  onOpenSaveDialog: () => void;
}

/**
 * Actions for the collapsed bar.
 *
 * The informational half is a shortcut per editor tab: clicking one expands the
 * panel on that tab rather than opening a dialog. Editing therefore always
 * happens in the panel, where the save button is visible — a floating form that
 * had lost its context could never say what it was saving.
 *
 * Only genuine modal decisions remain as dialogs: terminate, undo and save.
 */
export const useMinimizedBarActions = ({
  stopPlace,
  isModified,
  canEdit,
  canDelete,
  onOpenTab,
  onOpenTerminateDialog,
  onOpenUndoDialog,
  onOpenSaveDialog,
}: UseMinimizedBarActionsParams): MinimizedBarAction[] => {
  const { formatMessage } = useIntl();
  const isTabDirty = useStopPlaceTabDirty();

  const tabShortcuts: MinimizedBarAction[] = STOP_PLACE_TABS.map((tab) => {
    const label = formatMessage({ id: tab.labelId });
    return {
      id: `tab-${tab.id}`,
      icon: (
        <DirtyBadge dirty={isTabDirty(tab.dirtyKeys)}>
          {tab.renderIcon()}
        </DirtyBadge>
      ),
      label,
      tooltip: label,
      onClick: () => onOpenTab(tab.index),
    };
  });

  const terminateAction: MinimizedBarAction[] =
    stopPlace.id && canDelete
      ? [
          {
            id: "terminate",
            icon: <DeleteIcon fontSize="small" />,
            label: formatMessage({
              id: stopPlace.hasExpired
                ? "delete_stop_place"
                : "terminate_stop_place",
            }),
            onClick: onOpenTerminateDialog,
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
          icon: <UndoIcon fontSize="small" />,
          label: formatMessage({ id: "undo_changes" }),
          onClick: onOpenUndoDialog,
          disabled: !isModified,
          group: "action" as const,
          tooltip: formatMessage({ id: "undo_changes" }),
        },
        {
          id: "save",
          icon: <SaveIcon fontSize="small" />,
          label: formatMessage({ id: "save" }),
          onClick: onOpenSaveDialog,
          disabled: !isModified || !stopPlace.name,
          color: "primary" as const,
          group: "action" as const,
          tooltip: formatMessage({ id: "save" }),
        },
      ]
    : [];

  return [...tabShortcuts, ...terminateAction, ...editActions];
};
