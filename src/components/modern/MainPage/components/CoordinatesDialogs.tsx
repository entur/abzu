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

import React from "react";
import FavoriteNameDialog from "../../../Dialogs/FavoriteNameDialog";
import { CoordinatesDialog } from "../../Dialogs/CoordinatesDialog";
import { CoordinatesDialogsProps } from "../types";

export const CoordinatesDialogs: React.FC<CoordinatesDialogsProps> = ({
  lookupCoordinatesOpen,
  coordinatesDialogOpen,
  onCloseLookupCoordinates,
  onSubmitLookupCoordinates,
  onCloseCoordinates,
  onSubmitCoordinates,
}) => {
  return (
    <>
      <CoordinatesDialog
        open={lookupCoordinatesOpen}
        handleClose={onCloseLookupCoordinates}
        handleConfirm={onSubmitLookupCoordinates}
        titleId="lookup_coordinates"
      />

      <CoordinatesDialog
        open={coordinatesDialogOpen}
        handleClose={onCloseCoordinates}
        handleConfirm={onSubmitCoordinates}
      />

      <FavoriteNameDialog />
    </>
  );
};
