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

  if (props.isMultimodal !== nextProps.isMultimodal) {
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
