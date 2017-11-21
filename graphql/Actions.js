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
  mutateGroupOfStopPlaces
} from './Mutations';
import {
  allVersionsOfStopPlace,
  allEntities,
  stopPlaceBBQuery,
  getMergeInfoStopPlace,
  topopGraphicalPlacesQuery,
  findStop,
  getStopPlacesById,
  getPolygons,
  getTagsQuery,
  findTagByNameQuery,
  getStopById,
  getQueryTopographicPlaces,
  getTagsByNameQuery,
  getGroupOfStopPlaceQuery
} from '../graphql/Queries';
import mapToMutationVariables from '../modelUtils/mapToQueryVariables';

export const findTagByName = (client, name) =>
  client.query({
    query: findTagByNameQuery,
    fetchPolicy: 'network-only',
    variables: {
      name
    }
  });

export const addTag = (client, idReference, name, comment) =>
  client.mutate({
    mutation: mutateCreateTag,
    fetchPolicy: 'network-only',
    variables: {
      idReference,
      name,
      comment
    }
  });

export const getStopPlaceById = (client, id) =>
  client.query({
    query: getStopById,
    fetchPolicy: 'network-only',
    variables: {
      id
    }
  });

export const getAddStopPlaceInfo = (client, stopPlaceIds) =>
  client.query({
    query: getStopPlacesById(stopPlaceIds),
    operationName: 'getAddStopPlaceInfo',
    fetchPolicy: 'network-only'
  });

export const saveStopPlaceBasedOnType = (client, stopPlace, userInput) => {

  const { isChildOfParent } = stopPlace;

  if (!isChildOfParent) {

    const variables = mapToMutationVariables.mapStopToVariables(
      stopPlace,
      userInput
    );

    return new Promise((resolve, reject) => {
      client.mutate({
        mutation: mutateStopPlace,
        variables,
        fetchPolicy: 'network-only'
      }).then( result => {
        if (result.data.mutateStopPlace[0].id) {
          resolve(result.data.mutateStopPlace[0].id);
        } else {
          reject("Id not returned");
        }
      }).catch( err => {
        reject(err);
      });
    });
  } else {

    return new Promise((resolve, reject) => {

      const variables = mapToMutationVariables.mapChildStopToVariables(
        stopPlace,
        userInput
      );

      client.mutate({
        mutation: updateChildOfParentStop,
        variables,
        fetchPolicy: 'network-only'
      }).then( result => {
        resolve(stopPlace.id);
      }).catch( err => {
        reject(err);
      });
    });
  }
}

export const saveParentStopPlace = (client, variables) =>
  client.mutate({
    mutation: mutateParentStopPlace,
    variables,
    fetchPolicy: 'network-only'
  });

export const removeStopPlaceFromMultiModalStop = (client, parentSiteRef, stopPlaceId) =>
  client.mutate({
    mutation: removeStopPlaceFromParent,
    variables: {
      stopPlaceId,
      parentSiteRef
    },
    fetchPolicy: 'network-only'
  });

export const deleteQuay = (client, variables) =>
  client.mutate({
    mutation: mutateDeleteQuay,
    variables,
    fetchPolicy: 'network-only'
  });

export const deleteStopPlace = (client, stopPlaceId) =>
  client.mutate({
    mutation: mutateDeleteStopPlace,
    variables: {
      stopPlaceId
    },
    fetchPolicy: 'network-only'
  });

export const terminateStop = (client, stopPlaceId, versionComment, toDate) =>
  client.mutate({
    mutation: mutateTerminateStopPlace,
    variables: {
      stopPlaceId,
      versionComment,
      toDate
    }
  })

export const addToMultiModalStopPlace = (client, parentSiteRef, stopPlaceIds) =>
  client.mutate({
    mutation: mutateAddToMultiModalStopPlace,
    variables: {
      stopPlaceIds,
      parentSiteRef
    },
    fetchPolicy: 'network-only'
  });

export const createParentStopPlace = (client, {name, description, versionComment, coordinates, validBetween, stopPlaceIds}) =>
  client.mutate({
    mutation: mutateCreateMultiModalStopPlace,
    variables: {
      name,
      description,
      versionComment,
      coordinates,
      validBetween,
      stopPlaceIds
    },
    fetchPolicy: 'network-only'
  });


export const mutateGroupOfStopPlace = (client, variables) =>
  new Promise((resolve, reject) => {
    client.mutate({
      mutation: mutateGroupOfStopPlaces,
      variables,
      fetchPolicy: 'network-only'
    }).then(({data}) =>{
      const id = data['mutateGroupOfStopPlaces']
        ? data['mutateGroupOfStopPlaces'].id
        : null;
      resolve(id);
    }).catch(err => {
      reject(null);
    });
  });

export const getStopPlaceVersions = (client, stopPlaceId) =>
  client.query({
    query: allVersionsOfStopPlace,
    variables: {
      id: stopPlaceId
    },
    fetchPolicy: 'network-only'
  });

export const mergeQuays = (client, stopPlaceId, fromQuayId, toQuayId, versionComment) =>
  client.mutate({
    mutation: mutateMergeQuays,
    variables: {
      stopPlaceId,
      fromQuayId,
      toQuayId,
      versionComment
    },
    fetchPolicy: 'network-only'
  });

export const getStopPlaceWithAll = (client, id) => (
  client.query({
    query: allEntities,
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  })
);

export const mergeAllQuaysFromStop = (client, fromStopPlaceId, toStopPlaceId, fromVersionComment, toVersionComment) => (
  client.mutate({
    mutation: mutateMergeStopPlaces,
    variables: {
      fromStopPlaceId,
      toStopPlaceId,
      fromVersionComment,
      toVersionComment
    },
    fetchPolicy: 'network-only'
  })
);

export const moveQuaysToStop = (client, toStopPlaceId, quayId, fromVersionComment, toVersionComment) => (
  client.mutate({
    mutation: mutateMoveQuaysToStop,
    variables: {
      toStopPlaceId,
      quayId,
      fromVersionComment,
      toVersionComment,
    },
    fetchPolicy: 'network-only'
  })
);

export const moveQuaysToNewStop = (client, quayIds, fromVersionComment, toVersionComment) => (
  client.mutate({
    mutation: mutateMoveQuaysToNewStop,
    variables: {
      quayIds,
      fromVersionComment,
      toVersionComment
    }
  })
);

export const getNeighbourStops = (client, ignoreStopPlaceId, bounds, includeExpired) => (
  client.query({
    fetchPolicy: 'network-only',
    query: stopPlaceBBQuery,
    variables: {
      includeExpired: includeExpired,
      ignoreStopPlaceId,
      latMin: bounds.getSouthWest().lat,
      latMax: bounds.getNorthEast().lat,
      lonMin: bounds.getSouthWest().lng,
      lonMax: bounds.getNorthEast().lng,
    }
  })
);

export const getPolygon = (client, ids) => (
  client.query({
    fetchPolicy: 'network-only',
    query: getPolygons(ids),
    operationName: 'getPolygons',
  })
);

export const getTopographicPlaces = (client, ids) =>
  client.query({
    fetchPolicy: 'network-only',
    query: getQueryTopographicPlaces(ids),
    operationName: 'topographicPlacesForQuery'
  });

export const getMergeInfoForStops = (client, stopPlaceId) => (
  client.query({
    fetchPolicy: 'network-only',
    query: getMergeInfoStopPlace,
    variables: {
     stopPlaceId
    }
  })
);

export const findStopWithFilters = (client, query, stopPlaceType, chips, ignorePointTime) => {
  const municipalityReference = chips
  .filter(topos => topos.type === 'municipality')
    .map(topos => topos.value);
  const countyReference = chips
    .filter(topos => topos.type === 'county')
    .map(topos => topos.value);

  return client.query({
    query: findStop,
    fetchPolicy: 'network-only',
    variables: {
      query,
      stopPlaceType,
      municipalityReference: municipalityReference ,
      countyReference: countyReference,
      pointInTime: ignorePointTime ? null : new Date().toISOString()
    },
  });
};

export const findTopographicalPlace = (client, query) =>
  client.query({
  query: topopGraphicalPlacesQuery,
  fetchPolicy: 'network-only',
  variables: {
    query,
  },
});

export const getTags = (client, idReference) =>
  client.query({
    query: getTagsQuery,
    fetchPolicy: 'network-only',
    variables: {
      idReference,
    },
  });

export const getTagsByName = (client, name) =>
  client.query({
    query: getTagsByNameQuery,
    fetchPolicy: 'network-only',
    variables: {
      name,
    },
  });

export const removeTag = (client, name, idReference) =>
  client.mutate({
    mutation: mutateRemoveTag,
    variables: {
      name,
      idReference
    },
    fetchPolicy: 'network-only'
  });

export const getGroupOfStopPlaceBy = (client, id) =>
  client.query({
    query: getGroupOfStopPlaceQuery,
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  });