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

import { markBranchHit } from "../test/instrumentation/coverageData";

export const getMarkersForMap = ({ stopPlace, user }) => {
  const { newStop, findCoordinates, activeSearchResult, neighbourStops } =
    stopPlace;

  const { isCreatingNewStop } = user;

  let markers = activeSearchResult ? [activeSearchResult] : [];

  if (
    activeSearchResult &&
    activeSearchResult.isParent &&
    activeSearchResult.children
  ) {
    markers = markers.concat(activeSearchResult.children);
    markBranchHit("getMarkersForMap", 0);
  }

  if (newStop && isCreatingNewStop) {
    markers = markers.concat(newStop);
    markBranchHit("getMarkersForMap", 1);
  }

  if (neighbourStops && neighbourStops.length) {
    markers = markers.concat(neighbourStops);
    markBranchHit("getMarkersForMap", 2);
  }

  if (findCoordinates) {
    markers = markers.concat(findCoordinates);
    markBranchHit("getMarkersForMap", 3);
  }

  markers = markers.filter((m) => !m.permanentlyTerminated);

  return markers;
};
