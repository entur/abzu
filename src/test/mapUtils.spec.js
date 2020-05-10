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

import { getCentroid, isCoordinatesInsidePolygon } from "../utils/mapUtils";
import polygonVestfold from "./mock/polygon-vestfold";

describe("mapUtils", () => {
  test("should return centroid of a list of latlngs", () => {
    const latlngs = [
      [37, -109.05],
      [41, -109.03],
      [41, -102.05],
      [37, -102.04],
    ];
    const expectedCentroid = [39, -105.545];
    const centroid = getCentroid(latlngs, null);

    expect(centroid).toEqual(expectedCentroid);
  });

  test("should handle getCentroid of an empty list of latlngs by returning original centroid", () => {
    const emptyListOfLatLngs = [];
    const originalCentroid = [39.2, -10.2];
    const centroid = getCentroid(emptyListOfLatLngs, originalCentroid);

    expect(centroid).toEqual(originalCentroid);
  });

  test("is latLng inside polygon", () => {
    let latLngSandefjord = [59.135352, 10.222701];
    let latLngOsloS = [59.909512, 10.753839];
    let latLngVerketNearVestfold = [59.613143, 10.4132];

    let isSandefjordInside = isCoordinatesInsidePolygon(
      latLngSandefjord,
      polygonVestfold
    );
    let isOsloSInside = isCoordinatesInsidePolygon(
      latLngOsloS,
      polygonVestfold
    );
    let isVerketNearVestFoldInside = isCoordinatesInsidePolygon(
      latLngVerketNearVestfold,
      polygonVestfold
    );

    expect(isSandefjordInside).toEqual(true);
    expect(isVerketNearVestFoldInside).toEqual(false);
    expect(isOsloSInside).toEqual(false);
  });
});
