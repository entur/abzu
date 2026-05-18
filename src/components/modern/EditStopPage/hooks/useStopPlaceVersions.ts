/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 *  the European Commission - subsequent versions of the EUPL (the "Licence");
 *  You may not use this work except in compliance with the Licence.
 *  You may obtain a copy of the Licence at:
 *
 *    https://joinup.ec.europa.eu/software/page/eupl
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the Licence is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the Licence for the specific language governing permissions and
 *  limitations under the Licence. */

import { useCallback, useRef, useState } from "react";
import { getStopPlaceVersions } from "../../../../actions/TiamatActions.modern";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

interface UseStopPlaceVersionsReturn {
  versions: any[];
  versionsLoading: boolean;
  fetchVersions: () => void;
}

/**
 * Manages lazy loading of stop place version history.
 *
 * Versions are NOT fetched on initial page load (they were removed from the
 * primary allEntitiesWithoutVersions query). This hook fetches them once on
 * first call to fetchVersions for a given stop place ID, then caches the
 * result in Redux for subsequent dialog opens without re-fetching.
 *
 * After a save, useStopPlaceCRUD already dispatches getStopPlaceVersions
 * independently, so versions are always fresh in Redux after mutations.
 */
export const useStopPlaceVersions = (
  stopPlaceId: string | undefined,
): UseStopPlaceVersionsReturn => {
  const dispatch = useAppDispatch();
  const versions = useAppSelector(
    (state: any) => state.stopPlace.versions ?? [],
  );
  const [versionsLoading, setVersionsLoading] = useState(false);

  // Tracks which stop ID we have already fetched versions for so we do not
  // refetch on every dialog open/close cycle.
  const fetchedForIdRef = useRef<string | null>(null);

  // When stopPlaceId changes the ref naturally becomes stale (old ID ≠ new ID),
  // so the next fetchVersions call will trigger a fresh request automatically.
  const fetchVersions = useCallback(() => {
    if (!stopPlaceId || fetchedForIdRef.current === stopPlaceId) return;
    fetchedForIdRef.current = stopPlaceId;
    setVersionsLoading(true);
    (
      dispatch(getStopPlaceVersions(stopPlaceId)) as unknown as Promise<void>
    ).finally(() => setVersionsLoading(false));
  }, [dispatch, stopPlaceId]);

  return { versions, versionsLoading, fetchVersions };
};
