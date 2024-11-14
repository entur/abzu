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

import { getAllowanceInfoForStop } from "../reducers/rolesReducerUtils";
import mockRailReplacementStop from "./mock/mockRailReplacementStop";
import mockRailStop from "./mock/mockRailStop";
import mockBusStop from "./mock/mockBusStop";
import mockStopWithoutModality from "./mock/mockStopWithoutModality";
import { mockedAllowanceInfoAction } from "./mock/mockedAllowanceInfoAction";

describe("User and roles - scenarios", () => {
  test("nsbEditStops - train and railReplacementBus - verify railReplacementBus ", () => {
    const mockStopWithPermissions = {
      data: {
        pathLink: mockRailReplacementStop.data.pathLink,
        stopPlace: mockRailReplacementStop.data.stopPlace.map((stop) => ({
          ...stop,
          permissions: {
            canEdit: true,
            canDelete: false,
            allowedStopPlaceTypes: ["railStation"],
            allowedSubmodes: ["railReplacementBus"],
            bannedStopPlaceTypes: [],
            bannedSubmodes: [],
          },
        })),
      },
    };

    const allowanceInfo = getAllowanceInfoForStop(
      mockedAllowanceInfoAction(mockStopWithPermissions),
    );
    expect(allowanceInfo.canEdit).toEqual(true);
  });

  test("nsbEditStops - train and railReplacementBus - verify railStation", () => {
    const mockStopWithPermissions = {
      data: {
        pathLink: mockRailStop.data.pathLink,
        stopPlace: mockRailStop.data.stopPlace.map((stop) => ({
          ...stop,
          permissions: {
            canEdit: true,
            canDelete: false,
            allowedStopPlaceTypes: ["railStation"],
            allowedSubmodes: ["railReplacementBus"],
            bannedStopPlaceTypes: [],
            bannedSubmodes: [],
          },
        })),
      },
    };

    const allowanceInfo = getAllowanceInfoForStop(
      mockedAllowanceInfoAction(mockStopWithPermissions),
    );
    expect(allowanceInfo.canEdit).toEqual(true);
  });

  test("nsbEditStops - train and railReplacementBus - verify railStation", () => {
    const mockRailStopWithPermissions = {
      data: {
        pathLink: mockRailStop.data.pathLink,
        stopPlace: mockRailStop.data.stopPlace.map((stop) => ({
          ...stop,
          permissions: {
            canEdit: true,
            canDelete: false,
            allowedStopPlaceTypes: ["railStation"],
            allowedSubmodes: ["railReplacementBus"],
            bannedStopPlaceTypes: [],
            bannedSubmodes: [],
          },
        })),
      },
    };

    const allowanceInfo = getAllowanceInfoForStop(
      mockedAllowanceInfoAction(mockRailStopWithPermissions),
    );
    expect(allowanceInfo.canEdit).toEqual(true);

    const mockBusStopWithPermissions = {
      data: {
        pathLink: mockBusStop.data.pathLink,
        stopPlace: mockBusStop.data.stopPlace.map((stop) => ({
          ...stop,
          permissions: {
            canEdit: false,
            canDelete: false,
            allowedStopPlaceTypes: [],
            allowedSubmodes: [],
            bannedStopPlaceTypes: [],
            bannedSubmodes: [],
          },
        })),
      },
    };

    const allowanceBusStop = getAllowanceInfoForStop(
      mockedAllowanceInfoAction(mockBusStopWithPermissions),
    );
    expect(allowanceBusStop.canEdit).toEqual(false);
  });
});
