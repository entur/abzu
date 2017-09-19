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

import ParentStopPlace from './ParentStopPlace';
import StopPlace from './StopPlace';

class ChildOfParentStopPlace {

  constructor(stop, isActive, parking, userDefinedCoordinates, resourceId) {
    this.stop = stop;
    this.isActive = isActive;
    this.parking = parking;
    this.userDefinedCoordinates = userDefinedCoordinates;
    this.resourceId = resourceId;
  }

  getStopPlaceByResourceId() {
    const { children } = this.stop;

    if (!children) return null;

    for (let i = 0; i < children.length; i++) {
      if (children[i].id === this.resourceId) {
        return new StopPlace(
          children[i],
          this.isActive,
          this.parking,
          this.userDefinedCoordinates
        ).toClient();
      }
    }
    return null;
  }

  toClient() {
    try {
      const stopPlace = this.getStopPlaceByResourceId();
      stopPlace.isChildOfParent = true;
      stopPlace.isParent = false;
      stopPlace.parentStop = new ParentStopPlace(
        this.stop,
        this.isActive,
        this.parking,
        this.userDefinedCoordinates
      ).toClient();

      stopPlace.name = stopPlace.parentStop.name;
      stopPlace.validBetween = { ... stopPlace.parentStop.validBetween };

      return stopPlace;
  } catch (e) {
      console.log("Unable to map childOfParentStopPlace", e);
      return null;
    }
  }
}

export default ChildOfParentStopPlace;
