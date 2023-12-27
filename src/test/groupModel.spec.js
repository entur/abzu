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

import GroupOfStopPlaces from "../models/GroupOfStopPlaces";
import mockGroupOfStopPlaces from "./mock/mockGroupOfStopPlaces";

describe("Group of stop places - models", () => {
  test("should retrive a unique list of topographic places for members of a group", () => {
    const clientGOS = new GroupOfStopPlaces(
      mockGroupOfStopPlaces,
      true,
    ).toClient();
    expect(clientGOS.topographicPlaces).toMatchSnapshot();
  });
});
