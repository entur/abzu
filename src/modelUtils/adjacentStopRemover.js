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


const AdjacentStopRemover = {};

AdjacentStopRemover.removeAdjacentStop = (currentStop, adjacentStopPlaceRef, stopPlaceIdForRemovingAdjacentSite) => {

    if(currentStop.isParent) {

      const childrenCopy = currentStop.children.slice();

      childrenCopy.forEach(child => {
        if(child.id == stopPlaceIdForRemovingAdjacentSite) {
          AdjacentStopRemover.removeAdjacentStopFromChild(child, adjacentStopPlaceRef);
        } else if(child.id == adjacentStopPlaceRef) {
          AdjacentStopRemover.removeAdjacentStopFromChild(child, stopPlaceIdForRemovingAdjacentSite);
        }
      });
      return {
        ...currentStop,
        childrenCopy
     };
    }
    return currentStop;
}

AdjacentStopRemover.removeAdjacentStopFromChild = (child, adjacentRefToRemove) => {
  const result = child.adjacentSites.filter(adjacentSite => adjacentSite.ref !== adjacentRefToRemove);
  child.adjacentSites = result;
}

export default AdjacentStopRemover;
