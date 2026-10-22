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

import { Alert, Snackbar } from "@mui/material";
import { createContext, ReactNode, useCallback, useState } from "react";
import { useIntl } from "react-intl";

const NOTICE_DURATION_MS = 5000;

/** Shows a short message about something the map refused to do. */
export type ShowMapNotice = (messageId: string) => void;

export const MapNoticeContext = createContext<ShowMapNotice>(() => {});

interface MapNoticeProviderProps {
  children: ReactNode;
}

/**
 * Wraps the map so markers and controls can explain a refused action (e.g. a
 * move outside the user's edit area). The legacy snackbar can't be used for
 * this: it only knows "saved" / "failed" and closes at once.
 */
export const MapNoticeProvider = ({ children }: MapNoticeProviderProps) => {
  const { formatMessage } = useIntl();
  const [messageId, setMessageId] = useState<string | null>(null);

  const showNotice = useCallback<ShowMapNotice>((id) => setMessageId(id), []);
  const handleClose = () => setMessageId(null);

  return (
    <MapNoticeContext.Provider value={showNotice}>
      {children}
      <Snackbar
        open={!!messageId}
        autoHideDuration={NOTICE_DURATION_MS}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="warning" variant="filled" onClose={handleClose}>
          {messageId ? formatMessage({ id: messageId }) : ""}
        </Alert>
      </Snackbar>
    </MapNoticeContext.Provider>
  );
};
