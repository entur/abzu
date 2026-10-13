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

import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { ConfirmDialog } from "../../Dialogs/ConfirmDialog";
import { useLeaveGuard } from "./hooks/useLeaveGuard";
import { UnsavedChangesGuardContext } from "./UnsavedChangesGuardContext";

interface UnsavedChangesGuardProps {
  children: ReactNode;
}

/**
 * Mounted once around the modern app shell. Asks Discard / Cancel whenever the
 * user would leave a stop place, multimodal stop or group with unsaved changes.
 */
export const UnsavedChangesGuard = ({ children }: UnsavedChangesGuardProps) => {
  const { formatMessage } = useIntl();
  const { pendingEditor, confirmLeave, discardAndLeave, stay } =
    useLeaveGuard();

  const bodyKey =
    pendingEditor === "group"
      ? "discard_changes_group_body"
      : "discard_changes_body";

  return (
    <UnsavedChangesGuardContext.Provider value={confirmLeave}>
      {children}
      <ConfirmDialog
        open={pendingEditor !== null}
        title={formatMessage({ id: "discard_changes_title" })}
        body={formatMessage({ id: bodyKey })}
        confirmText={formatMessage({ id: "discard_changes_confirm" })}
        cancelText={formatMessage({ id: "discard_changes_cancel" })}
        onConfirm={discardAndLeave}
        onClose={stay}
      />
    </UnsavedChangesGuardContext.Provider>
  );
};
