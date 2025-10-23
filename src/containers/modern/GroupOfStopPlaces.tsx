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

import { useEffect, useState } from "react";
import { StopPlacesGroupActions, UserActions } from "../../actions/";
import { getGroupOfStopPlacesById } from "../../actions/TiamatActions";
import GroupErrorDialog from "../../components/Dialogs/GroupErrorDialog";
import Loader from "../../components/Dialogs/Loader";
import GroupOfStopPlaceMap from "../../components/GroupOfStopPlaces/GroupOfStopPlacesMap";
import { EditGroupOfStopPlaces } from "../../components/modern/GroupOfStopPlaces";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

type ErrorType = "NOT_FOUND" | "SERVER_ERROR";

interface ErrorDialog {
  open: boolean;
  type: ErrorType;
}

/**
 * Modern container for Group of Stop Places
 * Handles loading, error states, and map rendering
 */
const GroupOfStopPlaces: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoadingGroup, setIsLoadingGroup] = useState(false);
  const [errorDialog, setErrorDialog] = useState<ErrorDialog>({
    open: false,
    type: "NOT_FOUND",
  });

  // Redux state
  const position = useAppSelector(
    (state) => state.stopPlacesGroup.centerPosition,
  );
  const zoom = useAppSelector((state) => state.stopPlacesGroup.zoom);
  const isFetchingMember = useAppSelector(
    (state) => state.stopPlacesGroup.isFetchingMember,
  );
  const sourceForNewGroup = useAppSelector(
    (state) => state.stopPlacesGroup.sourceForNewGroup,
  );

  const handleErrorDialogClose = () => {
    dispatch(UserActions.navigateTo("/", ""));
    setErrorDialog({
      open: false,
      type: "NOT_FOUND",
    });
  };

  const handleNewGroupOfStopPlace = () => {
    if (sourceForNewGroup) {
      dispatch(StopPlacesGroupActions.createNewGroup(sourceForNewGroup));
    } else {
      dispatch(UserActions.navigateTo("/", ""));
    }
  };

  const handleFetchGroup = (groupId: string) => {
    setIsLoadingGroup(true);

    dispatch(getGroupOfStopPlacesById(groupId))
      .then(({ data }: any) => {
        setIsLoadingGroup(false);
        if (data.groupOfStopPlaces && !data.groupOfStopPlaces.length) {
          setErrorDialog({
            open: true,
            type: "NOT_FOUND",
          });
        }
      })
      .catch(() => {
        setErrorDialog({
          open: true,
          type: "SERVER_ERROR",
        });
      });
  };

  useEffect(() => {
    const idFromPath = window.location.pathname
      .substring(window.location.pathname.lastIndexOf("/"))
      .replace("/", "");
    const isNewGroup = idFromPath === "new";

    if (isNewGroup) {
      handleNewGroupOfStopPlace();
    } else if (idFromPath) {
      handleFetchGroup(idFromPath);
    }
  }, []);

  return (
    <div>
      {isLoadingGroup || errorDialog.open ? (
        <Loader />
      ) : (
        <EditGroupOfStopPlaces />
      )}
      {isFetchingMember && <Loader />}
      {!isLoadingGroup && zoom && (
        <GroupOfStopPlaceMap position={position} zoom={zoom} />
      )}

      <GroupErrorDialog
        open={errorDialog.open}
        errorType={errorDialog.type}
        handleOK={handleErrorDialogClose}
      />
    </div>
  );
};

export default GroupOfStopPlaces;
