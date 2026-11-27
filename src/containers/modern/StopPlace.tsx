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

import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { createSelector } from "@reduxjs/toolkit";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { UserActions } from "../../actions";
import { getStopPlaceWithAll } from "../../actions/TiamatActions.modern";
import { EditParentStopPlace } from "../../components/modern/EditParentStopPlace";
import { EditStopPage } from "../../components/modern/EditStopPage";
import { LoadingDialog } from "../../components/modern/Shared";
import { LoadTimerBadge } from "../../components/modern/Shared/LoadTimerBadge";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";

const NEW_STOP_ROUTE_ID = "new";

const selectStopPlaceProps = createSelector(
  (state: RootState) => state,
  (state) => ({
    stopPlace: state.stopPlace.current || (state.stopPlace as any).newStop,
    originalStopPlace: (state.stopPlace as any).originalCurrent,
    stopPlaceLoading: state.stopPlace.loading,
  }),
);

/**
 * Modern stop place container — loads the stop place by URL id and renders
 * either EditStopPage or EditParentStopPlace. No legacy dependencies.
 */
export const StopPlace = () => {
  const { stopPlace, originalStopPlace, stopPlaceLoading } =
    useAppSelector(selectStopPlaceProps);

  const [error, setError] = useState({
    showErrorDialog: false,
    resourceNotFound: false,
  });

  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();

  const handleCloseErrorDialog = useCallback(() => {
    dispatch(UserActions.navigateTo("/", ""));
    setError((prev) => ({ ...prev, showErrorDialog: false }));
  }, [dispatch]);

  /* The id comes from the router, not window.location, so moving between two
     /stop_place/:stopId URLs always reloads (F-51). */
  const { stopId = "" } = useParams<{ stopId: string }>();

  /* null until the stop in the URL has loaded: the header's default title
     (the app name) shows meanwhile, instead of "Registry - Registry" or the
     previous stop's name (F-45). */
  const [title, setTitle] = useState<string | null>(null);

  /* Built from scratch each time: appending to the previous title made the
     location repeat once per render (F-45). */
  useEffect(() => {
    if (!stopPlace) return;
    const isLoadedStop = stopPlace.isNewStop || stopPlace.id === stopId;
    if (!isLoadedStop) return;
    if (stopPlace.isNewStop) {
      setTitle(formatMessage({ id: "_title_new_stop" }));
      return;
    }
    const name = originalStopPlace?.name ?? "";
    if (!name) return;
    setTitle(
      stopPlace.topographicPlace
        ? `${name}, ${stopPlace.topographicPlace}, ${stopPlace.parentTopographicPlace}`
        : name,
    );
  }, [stopPlace, originalStopPlace, formatMessage, stopId]);

  useEffect(() => {
    if (stopId === NEW_STOP_ROUTE_ID && !stopPlace) {
      dispatch(UserActions.navigateTo("/", ""));
      return;
    }

    if (stopId && stopId !== NEW_STOP_ROUTE_ID) {
      dispatch(getStopPlaceWithAll(stopId))
        .then((response: any) => {
          if (!response.data.stopPlace.length) {
            setError({ showErrorDialog: true, resourceNotFound: true });
          }
        })
        .catch(() => {
          setError({ showErrorDialog: true, resourceNotFound: false });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopId]);

  const isLoading = (!stopPlace && !error.showErrorDialog) || stopPlaceLoading;

  return (
    <div>
      {title && <Helmet title={title} />}
      <LoadingDialog
        open={isLoading}
        message={formatMessage({ id: "loading" })}
      />
      <Dialog
        open={error.showErrorDialog}
        onClose={() =>
          setError((prev) => ({ ...prev, showErrorDialog: false }))
        }
      >
        <DialogContent>
          {error.resourceNotFound
            ? formatMessage({ id: "error_stopPlace_404" }) + stopId
            : formatMessage({ id: "error_unable_to_load_stop" })}
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={handleCloseErrorDialog}
            color="secondary"
          >
            {formatMessage({ id: "cancel" })}
          </Button>
        </DialogActions>
      </Dialog>
      {stopPlace &&
        !stopPlaceLoading &&
        (stopPlace.isParent ? <EditParentStopPlace /> : <EditStopPage />)}
      <LoadTimerBadge />
    </div>
  );
};
