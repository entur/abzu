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

import ContentCopy from "@mui/icons-material/ContentCopy";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { CopyIdButtonProps } from "../GroupOfStopPlaces";
import { CopyStatus, useCopyToClipboard } from "./clipboard/useCopyToClipboard";

const TOOLTIP_ID_BY_STATUS: Record<CopyStatus, string> = {
  idle: "copy_id",
  copied: "copied",
  failed: "copy_failed",
};

/**
 * Copies an ID and says how it went (F-44): "Copied!", or, when the browser
 * refuses the clipboard, how to copy it by hand. Never fails silently.
 */
export const CopyIdButton: React.FC<CopyIdButtonProps> = ({
  idToCopy,
  size = "small",
  color,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { status, copy } = useCopyToClipboard();
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (idToCopy) copy(idToCopy);
  };

  return (
    <Tooltip
      title={formatMessage({ id: TOOLTIP_ID_BY_STATUS[status] })}
      placement="top"
      // Feedback stays up until it times out, even if focus or the pointer
      // moves (the fallback copy briefly takes focus).
      open={isHovered || status !== "idle"}
      onOpen={() => setIsHovered(true)}
      onClose={() => setIsHovered(false)}
    >
      <span>
        <IconButton
          size={size}
          onClick={handleCopy}
          disabled={!idToCopy}
          aria-label={formatMessage({ id: "copy_id" })}
          sx={{
            padding: 0.25,
            color: color || theme.palette.primary.main,
            "&:hover": {
              color: color || theme.palette.primary.dark,
            },
          }}
        >
          <ContentCopy sx={{ fontSize: "0.9em" }} />
        </IconButton>
      </span>
    </Tooltip>
  );
};
