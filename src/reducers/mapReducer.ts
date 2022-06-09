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

import { Action } from "redux";
import { ApolloQueryResult } from "../actions";
import * as types from "../actions/Types";
import { FareZone } from "../models/FareZone";
import Quay from "../models/Quay";
import { TariffZone } from "../models/TariffZone";
import SettingsManager from "../singletons/SettingsManager";
import { getStateByOperation } from "./mapReducerUtil";

export type MapState = {
  focusedElement: {
    type: string;
    index: number;
  };
  focusedBoardingPositionElement: {
    index: number;
    quayIndex: number;
  };
  mergingQuay: {
    isMerging: boolean;
    fromQuay: Quay | null;
    toQuay: Quay | null;
  };
  mergingQuayDialogOpen: boolean;
  deleteQuayDialogOpen: boolean;
  deleteStopDialogOpen: boolean;
  moveQuayDialogOpen: boolean;
  moveQuayToNewStopDialogOpen: boolean;
  movingQuayToNewStop: boolean | null;
  deletingQuay: boolean | null;
  movingQuay: boolean | null;
  deleteQuayImportedId: string[];
  fetchOTPInfoMergeLoading: boolean;
  fetchOTPInfoDeleteLoading: boolean;
  deleteQuayWarning: string | null;
  showFareZones: boolean;
  showTariffZones: boolean;
  fareZonesForFilter: FareZone[];
  tariffZonesForFilter: TariffZone[];
  fareZones: FareZone[];
  tariffZones: TariffZone[];
};

export const initialState: MapState = {
  focusedElement: {
    type: "quay",
    index: -1,
  },
  focusedBoardingPositionElement: {
    index: -1,
    quayIndex: -1,
  },
  mergingQuay: {
    isMerging: false,
    fromQuay: null,
    toQuay: null,
  },
  mergingQuayDialogOpen: false,
  deleteQuayDialogOpen: false,
  deleteStopDialogOpen: false,
  moveQuayDialogOpen: false,
  moveQuayToNewStopDialogOpen: false,
  movingQuayToNewStop: null,
  deletingQuay: null,
  movingQuay: null,
  deleteQuayImportedId: [],
  fetchOTPInfoMergeLoading: false,
  fetchOTPInfoDeleteLoading: false,
  deleteQuayWarning: null,
  showFareZones: new SettingsManager().getShowFareZonesInMap(),
  showTariffZones: new SettingsManager().getShowTariffZonesInMap(),
  fareZonesForFilter: [],
  tariffZonesForFilter: [],
  fareZones: [],
  tariffZones: [],
};

export type MapAction = Action &
  ApolloQueryResult & {
    payload: any;
  };

const mapReducer = (state = initialState, action: MapAction) => {
  switch (action.type) {
    case types.APOLLO_QUERY_RESULT:
      return getStateByOperation(state, action);
    case types.NAVIGATE_TO:
      return Object.assign({}, state, {
        focusedElement: {
          type: "quay",
          index: -1,
        },
      });

    case types.SET_ACTIVE_MAP:
      return Object.assign({}, state, { activeMap: action.payload });

    case types.SET_FOCUS_ON_ELEMENT:
      return Object.assign({}, state, {
        focusedElement: {
          index: action.payload.index,
          type: action.payload.type,
        },
      });

    case types.SET_FOCUS_ON_BOARDING_POSITION_ELEMENT:
      return Object.assign({}, state, {
        focusedBoardingPositionElement: {
          index: action.payload.index,
          quayIndex: action.payload.quayIndex,
        },
      });

    case types.SORTED_QUAYS:
      return Object.assign({}, state, {
        focusedElement: {
          index: -1,
          type: "quay",
        },
      });

    case types.SHOW_EDIT_STOP_ADDITIONAL:
      return Object.assign({}, state, {
        focusedElement: {
          index: -1,
          type: "quay",
        },
      });

    case types.STARTED_MERGING_QUAY_FROM:
      return Object.assign({}, state, {
        mergingQuay: {
          isMerging: true,
          fromQuay: action.payload,
          toQuay: null,
        },
      });

    case types.ENDED_MERGING_QUAY_TO:
      return Object.assign({}, state, {
        mergingQuayDialogOpen: true,
        fetchOTPInfoMergeLoading: true,
        mergingQuay: {
          ...state.mergingQuay,
          isMerging: false,
          toQuay: action.payload,
        },
      });

    case types.GET_QUAY_MERGE_OTP_INFO:
      return Object.assign({}, state, {
        fetchOTPInfoMergeLoading: false,
        mergeQuayWarning: action.payload,
      });

    case types.ERROR_QUAY_MERGE_OTP_INFO:
      return Object.assign({}, state, {
        fetchOTPInfoMergeLoading: false,
        mergeQuayWarning: null,
      });

    case types.CANCELLED_MERGING_QUAY_FROM:
      return Object.assign({}, state, {
        mergingQuay: {
          isMerging: false,
          fromQuay: null,
          toQuay: null,
        },
      });

    case types.CLOSED_MERGE_QUAYS_DIALOG:
      return Object.assign({}, state, {
        mergingQuayDialogOpen: false,
        mergeQuayWarning: null,
        fetchOTPInfoMergeLoading: false,
        mergingQuay: {
          isMerging: false,
          fromQuay: null,
          toQuay: null,
        },
      });

    case types.REQUESTED_DELETE_QUAY:
      return Object.assign({}, state, {
        deleteQuayDialogOpen: true,
        deletingQuay: action.payload.source,
        deleteQuayImportedId: action.payload.importedId,
        fetchOTPInfoDeleteLoading: true,
      });

    case types.GET_QUAY_DELETE_OTP_INFO:
      return Object.assign({}, state, {
        fetchOTPInfoDeleteLoading: false,
        deleteQuayWarning: action.payload,
      });

    case types.ERROR_QUAY_DELETE_OTP_INFO:
      return Object.assign({}, state, {
        fetchOTPInfoDeleteLoading: false,
        deleteQuayWarning: null,
      });

    case types.REQUESTED_MOVE_QUAY_NEW_STOP:
      return Object.assign({}, state, {
        moveQuayToNewStopDialogOpen: true,
        movingQuayToNewStop: action.payload,
      });

    case types.CANCELLED_MOVE_QUAY_NEW_STOP:
      return Object.assign({}, state, {
        moveQuayToNewStopDialogOpen: false,
        movingQuayToNewStop: null,
      });

    case types.TERMINATE_DELETE_STOP_DIALOG:
      return Object.assign({}, state, {
        deleteStopDialogOpen: true,
      });

    case types.CANCELLED_DELETE_STOP_DIALOG:
      return Object.assign({}, state, {
        deleteStopDialogOpen: false,
      });

    case types.CANCELLED_DELETE_QUAY_DIALOG:
      return Object.assign({}, state, {
        deleteQuayDialogOpen: false,
        deletingQuay: null,
        deleteQuayImportedId: [],
      });

    case types.CANCELLED_MOVE_QUAY_DIALOG:
      return Object.assign({}, state, {
        moveQuayDialogOpen: false,
        movingQuay: null,
      });

    case types.REQUESTED_MOVE_QUAY:
      return Object.assign({}, state, {
        moveQuayDialogOpen: true,
        movingQuay: action.payload,
      });

    case types.SHOW_REMOVE_STOP_PLACE_FROM_PARENT:
      return Object.assign({}, state, {
        removeStopPlaceFromParentOpen: true,
        removingStopPlaceFromParentId: action.payload,
      });

    case types.HIDE_REMOVE_STOP_PLACE_FROM_PARENT:
      return Object.assign({}, state, {
        removeStopPlaceFromParentOpen: false,
        removingStopPlaceFromParentId: null,
      });

    case types.TOGGLE_SHOW_FARE_ZONES_IN_MAP:
      return Object.assign({}, state, {
        showFareZones: action.payload,
      });

    case types.TOGGLE_SHOW_TARIFF_ZONES_IN_MAP:
      return Object.assign({}, state, {
        showTariffZones: action.payload,
      });

    default:
      return state;
  }
};

export default mapReducer;
