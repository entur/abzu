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
  }

  if (newStop && isCreatingNewStop) {
    markers = markers.concat(newStop);
  }

  if (neighbourStops && neighbourStops.length) {
    markers = markers.concat(
      neighbourStops.filter(
        (current) => !markers.some((exist) => current.id === exist.id)
      )
    );
  }

  if (findCoordinates) {
    markers = markers.concat(
      findCoordinates.filter(
        (current) => !markers.some((exist) => current.id === exist.id)
      )
    );
  }

  markers = markers.filter((m) => !m.permanentlyTerminated);

  let seen = new Set();
  let hasDuplicates = markers.some((current) => {
    return seen.size === seen.add(current.id).size;
  });

  console.log({ hasDuplicates });

  return markers;
};
