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

import {
  mutateDeleteQuay,
  mutateDeleteStopPlace,
  mutateMergeQuays,
  mutateMergeStopPlaces,
  mutateMoveQuaysToStop,
  mutateMoveQuaysToNewStop,
  mutateParentStopPlace,
  mutateAddToMultiModalStopPlace,
  mutateCreateMultiModalStopPlace,
  removeStopPlaceFromParent,
  mutateStopPlace,
  updateChildOfParentStop,
  mutateRemoveTag,
  mutateCreateTag,
  mutateTerminateStopPlace,
  mutateGroupOfStopPlaces,
  deleteGroupMutation,
  deleteParkingMutation,
} from "../graphql/Tiamat/mutations";
import {
  allVersionsOfStopPlace,
  allEntities,
  stopPlaceBBQuery,
  getMergeInfoStopPlace,
  topopGraphicalPlacesQuery,
  findStop,
  getStopPlacesById,
  getPolygons as getPolygonsQuery,
  getTagsQuery,
  findTagByNameQuery,
  getStopById,
  getQueryTopographicPlaces,
  getTagsByNameQuery,
  getGroupOfStopPlaceQuery,
  findTariffones,
  stopPlaceAndPathLinkByVersion,
  findStopForReport as findStopForReportQuery,
  getParkingForMultipleStopPlaces as getParkingForMultipleStopPlacesQuery,
  topopGraphicalPlacesReportQuery,
  neighbourStopPlaceQuays,
} from "../graphql/Tiamat/queries";
import mapToMutationVariables from "../modelUtils/mapToQueryVariables";

import { createApolloErrorThunk, createApolloThunk } from ".";
import * as types from "./Types";

const handleQuery = (client, payload) => (dispatch) =>
  client.query(payload).then((result) => {
    dispatch(
      createApolloThunk(
        types.APOLLO_QUERY_RESULT,
        result,
        payload.query,
        payload.variables
      )
    );
    return result;
  });

const handleMutation = (client, payload) => (dispatch) =>
  client
    .mutate(payload)
    .then((result) => {
      if (result?.errors?.length > 0) {
        dispatch(
          createApolloErrorThunk(
            types.APOLLO_MUTATION_ERROR,
            result.errors,
            payload.mutation,
            payload.variables
          )
        );
      } else {
        dispatch(
          createApolloThunk(
            types.APOLLO_MUTATION_RESULT,
            result,
            payload.mutation,
            payload.variables
          )
        );
        return result;
      }
    })
    .catch((e) => {
      dispatch(
        createApolloErrorThunk(
          types.APOLLO_MUTATION_ERROR,
          e,
          payload.mutation,
          payload.variables
        )
      );
      throw e;
    });

export const findTagByName = (name) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: findTagByNameQuery,
    fetchPolicy: "network-only",
    variables: {
      name,
    },
  })(dispatch);

export const addTag = (idReference, name, comment) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: mutateCreateTag,
    fetchPolicy: "no-cache",
    variables: {
      idReference,
      name,
      comment,
    },
  })(dispatch);

export const getStopPlaceById = (id) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: getStopById,
    fetchPolicy: "network-only",
    variables: {
      id,
    },
  })(dispatch);

export const getAddStopPlaceInfo = (stopPlaceIds) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: getStopPlacesById(stopPlaceIds),
    fetchPolicy: "network-only",
  })(dispatch);

export const saveStopPlaceBasedOnType = (stopPlace, userInput) => (
  dispatch,
  getState
) => {
  const { isChildOfParent } = stopPlace;

  if (!isChildOfParent) {
    const variables = mapToMutationVariables.mapStopToVariables(
      stopPlace,
      userInput
    );

    return new Promise((resolve, reject) => {
      handleMutation(getState().user.client, {
        mutation: mutateStopPlace,
        variables,
        fetchPolicy: "no-cache",
      })(dispatch)
        .then((result) => {
          if (result.data.mutateStopPlace[0].id) {
            resolve(result.data.mutateStopPlace[0].id);
          } else {
            reject("Id not returned");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  } else {
    return new Promise((resolve, reject) => {
      const variables = mapToMutationVariables.mapChildStopToVariables(
        stopPlace,
        userInput
      );

      handleMutation(getState().user.client, {
        mutation: updateChildOfParentStop,
        variables,
        fetchPolicy: "network-only",
      })(dispatch)
        .then((result) => {
          resolve(stopPlace.id);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
};

export const saveParentStopPlace = (variables) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: mutateParentStopPlace,
    variables,
    fetchPolicy: "no-cache",
  })(dispatch);

export const removeStopPlaceFromMultiModalStop = (
  parentSiteRef,
  stopPlaceId
) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: removeStopPlaceFromParent,
    variables: {
      stopPlaceId,
      parentSiteRef,
    },
    fetchPolicy: "network-only",
  })(dispatch);

export const deleteQuay = (variables) => (dispatch, getState) => {
  handleMutation(getState().user.client, {
    mutation: mutateDeleteQuay,
    variables,
    fetchPolicy: "no-cache",
  })(dispatch);
};

export const deleteStopPlace = (stopPlaceId) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: mutateDeleteStopPlace,
    variables: {
      stopPlaceId,
    },
    fetchPolicy: "no-cache",
  })(dispatch);

export const terminateStop = (
  stopPlaceId,
  shouldTerminatePermanently,
  versionComment,
  toDate
) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: mutateTerminateStopPlace,
    variables: {
      stopPlaceId,
      versionComment,
      toDate,
      modificationEnumeration: shouldTerminatePermanently ? "delete" : null,
    },
  })(dispatch);

export const addToMultiModalStopPlace = (parentSiteRef, stopPlaceIds) => (
  dispatch,
  getState
) =>
  handleMutation(getState().user.client, {
    mutation: mutateAddToMultiModalStopPlace,
    variables: {
      stopPlaceIds,
      parentSiteRef,
    },
    fetchPolicy: "no-cache",
  })(dispatch);

export const createParentStopPlace = ({
  name,
  description,
  versionComment,
  coordinates,
  validBetween,
  stopPlaceIds,
}) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: mutateCreateMultiModalStopPlace,
    variables: {
      name,
      description,
      versionComment,
      coordinates,
      validBetween,
      stopPlaceIds,
    },
    fetchPolicy: "no-cache",
  })(dispatch);

export const mutateGroupOfStopPlace = (variables) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    handleMutation(getState().user.client, {
      mutation: mutateGroupOfStopPlaces,
      variables,
      fetchPolicy: "no-cache",
    })(dispatch)
      .then(({ data }) => {
        const id = data["mutateGroupOfStopPlaces"]
          ? data["mutateGroupOfStopPlaces"].id
          : null;
        resolve(id);
      })
      .catch((err) => {
        reject(null);
      });
  });

export const getStopPlaceVersions = (stopPlaceId) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: allVersionsOfStopPlace,
    variables: {
      id: stopPlaceId,
    },
    fetchPolicy: "network-only",
  })(dispatch);

export const mergeQuays = (
  stopPlaceId,
  fromQuayId,
  toQuayId,
  versionComment
) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: mutateMergeQuays,
    variables: {
      stopPlaceId,
      fromQuayId,
      toQuayId,
      versionComment,
    },
    fetchPolicy: "no-cache",
  })(dispatch);

export const getStopPlaceWithAll = (id) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: allEntities,
    variables: {
      id,
    },
    fetchPolicy: "network-only",
  })(dispatch);

export const mergeAllQuaysFromStop = (
  fromStopPlaceId,
  toStopPlaceId,
  fromVersionComment,
  toVersionComment
) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: mutateMergeStopPlaces,
    variables: {
      fromStopPlaceId,
      toStopPlaceId,
      fromVersionComment,
      toVersionComment,
    },
    fetchPolicy: "no-cache",
  })(dispatch);

export const moveQuaysToStop = (
  toStopPlaceId,
  quayId,
  fromVersionComment,
  toVersionComment
) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: mutateMoveQuaysToStop,
    variables: {
      toStopPlaceId,
      quayId,
      fromVersionComment,
      toVersionComment,
    },
    fetchPolicy: "no-cache",
  })(dispatch);

export const moveQuaysToNewStop = (
  quayIds,
  fromVersionComment,
  toVersionComment
) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: mutateMoveQuaysToNewStop,
    variables: {
      quayIds,
      fromVersionComment,
      toVersionComment,
    },
    fetchPolicy: "no-cache",
  })(dispatch);

export const getNeighbourStops = (
  ignoreStopPlaceId,
  bounds,
  includeExpired
) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    fetchPolicy: "network-only",
    query: stopPlaceBBQuery,
    variables: {
      includeExpired: includeExpired,
      ignoreStopPlaceId,
      latMin: bounds.getSouthWest().lat,
      latMax: bounds.getNorthEast().lat,
      lonMin: bounds.getSouthWest().lng,
      lonMax: bounds.getNorthEast().lng,
    },
  })(dispatch);

export const getPolygons = (ids) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    fetchPolicy: "network-only",
    query: getPolygonsQuery(ids),
  })(dispatch);

export const getTopographicPlaces = (ids) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    fetchPolicy: "network-only",
    query: getQueryTopographicPlaces(ids),
  })(dispatch);

export const getMergeInfoForStops = (stopPlaceId) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    fetchPolicy: "network-only",
    query: getMergeInfoStopPlace,
    variables: {
      stopPlaceId,
    },
  })(dispatch);

export const findEntitiesWithFilters = (
  query,
  stopPlaceType,
  chips,
  showFutureAndExpired
) => (dispatch, getState) => {
  const municipalityReference = chips
    .filter((topos) => topos.type === "municipality")
    .map((topos) => topos.value);
  const countyReference = chips
    .filter((topos) => topos.type === "county")
    .map((topos) => topos.value);
  const countryReference = chips
    .filter((topos) => topos.type === "country")
    .map((topos) => topos.value);

  return handleQuery(getState().user.client, {
    query: findStop,
    fetchPolicy: "network-only",
    variables: {
      query,
      stopPlaceType,
      municipalityReference: municipalityReference,
      countyReference: countyReference,
      countryReference: countryReference,
      pointInTime: showFutureAndExpired ? null : new Date().toISOString(),
      versionValidity: showFutureAndExpired ? "MAX_VERSION" : null,
    },
  })(dispatch);
};

export const findTopographicalPlace = (query) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: topopGraphicalPlacesQuery,
    fetchPolicy: "network-only",
    variables: {
      query,
    },
  })(dispatch);

export const getTags = (idReference) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: getTagsQuery,
    fetchPolicy: "network-only",
    variables: {
      idReference,
    },
  })(dispatch);

export const getTagsByName = (name) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: getTagsByNameQuery,
    fetchPolicy: "network-only",
    variables: {
      name,
    },
  })(dispatch);

export const removeTag = (name, idReference) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: mutateRemoveTag,
    variables: {
      name,
      idReference,
    },
    fetchPolicy: "no-cache",
  })(dispatch);

export const getGroupOfStopPlacesById = (id) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: getGroupOfStopPlaceQuery,
    variables: {
      id,
    },
    fetchPolicy: "network-only",
  })(dispatch);

export const deleteGroupOfStopPlaces = (id) => (dispatch, getState) =>
  handleMutation(getState().user.client, {
    mutation: deleteGroupMutation,
    variables: {
      id,
    },
    fetchPolicy: "no-cache",
  })(dispatch);

export const getTariffZones = (query) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: findTariffones,
    variables: {
      query,
    },
    fetchPolicy: "network-only",
  })(dispatch);

export const deleteParking = (id) => (dispatch, getState) =>
  handleMutation(getState.user.client, {
    mutation: deleteParkingMutation,
    variables: {
      id,
    },
    fetchPolicy: "no-cache",
  })(dispatch);

export const getStopPlaceAndPathLinkByVersion = (id, version) => (
  dispatch,
  getState
) =>
  handleQuery(getState().user.client, {
    fetchPolicy: "network-only",
    query: stopPlaceAndPathLinkByVersion,
    variables: {
      id,
      version,
    },
  })(dispatch);

export const findStopForReport = (queryVariables) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: findStopForReportQuery,
    fetchPolicy: "network-only",
    variables: queryVariables,
  })(dispatch);

export const getParkingForMultipleStopPlaces = (stopPlaceIds) => (
  dispatch,
  getState
) =>
  handleQuery(getState().user.client, {
    query: getParkingForMultipleStopPlacesQuery(stopPlaceIds),
    fetchPolicy: "network-only",
  })(dispatch);

export const topographicalPlaceSearch = (searchText) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    query: topopGraphicalPlacesReportQuery,
    fetchPolicy: "network-only",
    variables: {
      query: searchText,
    },
  })(dispatch);

export const getNeighbourStopPlaceQuays = (id) => (dispatch, getState) =>
  handleQuery(getState().user.client, {
    fetchPolicy: "network-only",
    query: neighbourStopPlaceQuays,
    variables: {
      id: id,
    },
  })(dispatch);
