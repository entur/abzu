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

import { Alert } from "@mui/material";
import { useIntl } from "react-intl";

interface DialogErrorAlertProps {
  messageId: string | null;
}

/** Why the dialog's action failed; nothing when it didn't. */
export const DialogErrorAlert = ({ messageId }: DialogErrorAlertProps) => {
  const { formatMessage } = useIntl();
  if (!messageId) return null;
  return (
    <Alert severity="error" sx={{ mt: 1.5 }}>
      {formatMessage({ id: messageId })}
    </Alert>
  );
};
