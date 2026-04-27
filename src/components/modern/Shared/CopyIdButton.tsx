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

/**
 * Modern TypeScript copy ID button component
 * Copies provided ID to clipboard with visual feedback
 */
export const CopyIdButton: React.FC<CopyIdButtonProps> = ({
  idToCopy,
  size = "small",
  color,
}) => {
  const [copied, setCopied] = useState(false);
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (navigator.clipboard && idToCopy) {
      navigator.clipboard.writeText(idToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  return (
    <Tooltip
      title={
        copied
          ? formatMessage({ id: "copied" })
          : formatMessage({ id: "copy_id" })
      }
      placement="top"
      onClose={() => setCopied(false)}
    >
      <span>
        <IconButton
          size={size}
          onClick={handleCopy}
          disabled={!idToCopy}
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
