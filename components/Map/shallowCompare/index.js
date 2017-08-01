export const compareShallowQuayMarker = (props, nextProps) => {
  if (props.position !== nextProps.position) {
    return true;
  }

  if (props.publicCode !== nextProps.publicCode) {
    return true;
  }

  if (props.privateCode !== nextProps.privateCode) {
    return true;
  }

  if (props.index !== nextProps.index) {
    return true;
  }

  if (props.focusedElement !== nextProps.focusedElement) {
    return true;
  }

  if (props.belongsToNeighbourStop !== nextProps.belongsToNeighbourStop) {
    return true;
  }

  if (props.compassBearing !== nextProps.compassBearing) {
    return true;
  }

  if (props.isCompassBearingEnabled !== nextProps.isCompassBearingEnabled) {
    return true;
  }

  if (props.formattedStopType !== nextProps.formattedStopType) {
    return true;
  }

  if (props.isCreatingPolylines !== nextProps.isCreatingPolylines) {
    return true;
  }

  if (props.id !== nextProps.id) {
    return true;
  }

  if (props.pathLink !== nextProps.pathLink) {
    return true;
  }

  if (props.mergingQuay !== nextProps.mergingQuay) {
    return true;
  }

  return false;
};

export const shallowCompareParkNRide = (props, nextProps) => {
  if (JSON.stringify(props.position) !== JSON.stringify(nextProps.position)) {
    return true;
  }

  if (
    JSON.stringify(props.focusedElement) !==
    JSON.stringify(nextProps.focusedElement)
  ) {
    return true;
  }

  if (props.name !== nextProps.name) {
    return true;
  }

  if (props.hasExpired !== nextProps.hasExpired) {
    return true;
  }

  if (props.totalCapacity !== nextProps.totalCapacity) {
    return true;
  }

  return false;
};

export const shallowCompareNeighbourMarker = (props, nextProps) => {
  if (JSON.stringify(props.position) !== JSON.stringify(nextProps.position)) {
    return true;
  }

  if (props.stopType !== nextProps.stopType) {
    return true;
  }

  if (props.id !== nextProps.id) {
    return true;
  }

  if (props.isShowingQuays !== nextProps.isShowingQuays) {
    return true;
  }

  if (props.name !== nextProps.name) {
    return true;
  }

  if (props.hasExpired !== nextProps.hasExpired) {
    return true;
  }

  if (props.submode !== nextProps.submode) {
    return true;
  }

  return false;
};

export const shallowCycleParkingMarker = (props, nextProps) => {
  if (JSON.stringify(props.position) !== JSON.stringify(nextProps.position)) {
    return true;
  }

  if (
    JSON.stringify(props.focusedElement) !==
    JSON.stringify(nextProps.focusedElement)
  ) {
    return true;
  }

  if (props.name !== nextProps.name) {
    return true;
  }

  if (props.hasExpired !== nextProps.hasExpired) {
    return true;
  }

  if (props.totalCapacity !== nextProps.totalCapacity) {
    return true;
  }

  return false;
};

export const shallowCompareStopPlaceMarker = (props, nextProps) => {
  if (JSON.stringify(props.position) !== JSON.stringify(nextProps.position)) {
    return true;
  }

  if (props.draggable !== nextProps.draggable) {
    return true;
  }

  if (props.active !== nextProps.active) {
    return true;
  }

  if (props.stopType !== nextProps.stopType) {
    return true;
  }

  if (props.id !== nextProps.id) {
    return true;
  }

  if (props.isShowingQuays !== nextProps.isShowingQuays) {
    return true;
  }

  if (props.name !== nextProps.name) {
    return true;
  }

  if (props.submode !== nextProps.submode) {
    return true;
  }

  return false;
};
