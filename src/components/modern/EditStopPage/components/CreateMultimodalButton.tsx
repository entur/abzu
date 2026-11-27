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
import { Button } from "@mui/material";
import { useIntl } from "react-intl";
import { UserActions } from "../../../../actions";
import { useConfig } from "../../../../config/ConfigContext";
import { useAppDispatch } from "../../../../store/hooks";
import { useConfirmLeave } from "../../Shared/UnsavedChangesGuard";

interface StopForMultimodal {
  id?: string;
  hasExpired?: boolean;
  isParent?: boolean;
  isChildOfParent?: boolean;
}

interface CreateMultimodalButtonProps {
  stopPlace: StopForMultimodal;
  canEdit: boolean;
}

const UNSAVED_ID_PREFIX = "new_";

/**
 * "New multimodal stop place" from the open stop's editor (F-12a), next to the
 * memberships, with the same rules as the map popup's action: a saved,
 * editable, active stop that isn't multimodal or a child already. Leaving
 * goes through the unsaved-changes prompt.
 */
export const CreateMultimodalButton = ({
  stopPlace,
  canEdit,
}: CreateMultimodalButtonProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { modalityConfig } = useConfig();
  const confirmLeave = useConfirmLeave();

  const hasSavedId =
    !!stopPlace.id && !stopPlace.id.startsWith(UNSAVED_ID_PREFIX);
  const canCreate =
    hasSavedId &&
    canEdit &&
    !modalityConfig?.disableMultiModalStopPlaceCreation &&
    !stopPlace.hasExpired &&
    !stopPlace.isParent &&
    !stopPlace.isChildOfParent;
  if (!canCreate || !stopPlace.id) return null;

  const stopId = stopPlace.id;
  const handleCreate = () =>
    confirmLeave(() => {
      dispatch(UserActions.createMultimodalWith(stopId, true));
    });

  return (
    <Button
      size="small"
      variant="outlined"
      startIcon={<AccountTreeIcon />}
      onClick={handleCreate}
      sx={{ alignSelf: "flex-start", textTransform: "none", mb: 1.5 }}
    >
      {formatMessage({ id: "new__multi_stop" })}
    </Button>
  );
};
