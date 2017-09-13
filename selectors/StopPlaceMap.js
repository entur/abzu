export const getMarkersForMap = ({ stopPlace, user }) => {
  const {
    newStop,
    findCoordinates,
    activeSearchResult,
    neighbourStops
  } = stopPlace;

  const { isCreatingNewStop } = user;

  let markers = activeSearchResult ? [activeSearchResult] : [];

  if (
    activeSearchResult &&
    activeSearchResult.isParent &&
    activeSearchResult.children
  ) {
    markers = markers.concat(
      activeSearchResult.children.map(child => {
        child.name = activeSearchResult.name;
        return child;
      })
    );
  }

  if (newStop && isCreatingNewStop) {
    markers = markers.concat(newStop);
  }

  if (neighbourStops && neighbourStops.length) {
    markers = markers.concat(neighbourStops);
  }

  if (findCoordinates) {
    markers = markers.concat(findCoordinates);
  }

  return markers;
};
