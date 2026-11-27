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

import { useEffect, useRef } from "react";
import { createThunk } from "../../../actions";
import * as types from "../../../actions/Types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

/**
 * Reaching the map page with a stop still open means the editor was left
 * by the browser's Back button, which skips the editor's close: the stop
 * stayed loaded, its quays drawn and the map's + kept the editor menu
 * (S-14). Close it the way the editor's × does.
 */
export const useCloseLeftoverEditor = (): void => {
  const dispatch = useAppDispatch();
  const isStopOpen = useAppSelector(
    (state) => !!(state.stopPlace as any).current,
  );
  // As it was when the map page appeared; placing a new stop later opens one.
  const wasStopOpenOnArrival = useRef(isStopOpen);

  useEffect(() => {
    if (wasStopOpenOnArrival.current) {
      dispatch(createThunk(types.NAVIGATE_TO, ""));
    }
    // On arriving at the map page only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
