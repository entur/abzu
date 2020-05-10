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

import { extractCoordinates } from "../utils/";

describe("extractors", () => {
  test("should extract latlng from user provided string", () => {
    const latLngStringComma = "59.927582, 10.698881";
    const latLngFromComma = extractCoordinates(latLngStringComma);
    const latLngExpected = [59.927582, 10.698881];

    expect(latLngFromComma).toEqual(latLngExpected);

    const latLngStringSpace = "59.927582 10.698881";
    const latLngFromSpace = extractCoordinates(latLngStringSpace);

    expect(latLngFromSpace).toEqual(latLngExpected);

    const latLngStringTab = "59.927582  10.698881";

    const latLngFromTab = extractCoordinates(latLngStringTab);

    expect(latLngFromTab).toEqual(latLngExpected);
  });
});
