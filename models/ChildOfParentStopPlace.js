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
