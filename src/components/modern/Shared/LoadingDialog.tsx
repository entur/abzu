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

import { Dialog, DialogContent } from "@mui/material";
import React from "react";
import { ModalityLoadingAnimation } from "./ModalityLoadingAnimation";

interface LoadingDialogProps {
  open: boolean;
  message?: string;
}

/**
 * Centered loading dialog that displays a loading animation
 * Used when navigating to edit pages from search results
 */
export const LoadingDialog: React.FC<LoadingDialogProps> = ({
  open,
  message = "Loading...",
}) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "white",
          boxShadow: 3,
          overflow: "hidden",
          borderRadius: 2,
          minWidth: 320,
          minHeight: 220,
        },
      }}
    >
      <DialogContent
        sx={{
          padding: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:first-of-type": {
            paddingTop: 3,
          },
        }}
      >
        <ModalityLoadingAnimation message={message} />
      </DialogContent>
    </Dialog>
  );
};
