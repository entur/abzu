import {
  mutateDeleteQuay,
  mutateDeleteStopPlace,
  mutateMergeQuays,
  mutateMergeStopPlaces,
  mutateMoveQuaysToStop,
  mutateMoveQuaysToNewStop,
  mutateParentStopPlace,
  mutateAddToMultiModalStopPlace,
  mutateCreateMultiModalStopPlace
} from './Mutations';
import {
  allVersionsOfStopPlace,
  allEntities,
  stopPlaceBBQuery,
  getMergeInfoStopPlace,
  topopGraphicalPlacesQuery,
  findStop,
  getPolygons
} from '../graphql/Queries';


export const saveParentStopPlace = (client, variables) =>
  client.mutate({
    mutation: mutateParentStopPlace,
    variables,
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

export const addToMultiModalStopPlace = (client, parentSiteRef, stopPlaceIds) =>
  client.mutate({
    mutation: mutateAddToMultiModalStopPlace,
    variables: {
      stopPlaceIds,
      parentSiteRef
    },
    fetchPolicy: 'network-only'
  });

export const createParentStopPlace = (client, name, stopPlaceIds) =>
  client.mutate({
    mutation: mutateCreateMultiModalStopPlace,
    variables: {
      name,
      stopPlaceIds
    }
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

export const getMergeInfoForStops = (client, stopPlaceId) => (
  client.query({
    fetchPolicy: 'network-only',
    query: getMergeInfoStopPlace,
    variables: {
     stopPlaceId
    }
  })
);

export const findStopWithFilters = (client, query, stopPlaceType, chips) => {
  const municipalityReference = chips
  .filter(topos => topos.type === 'town')
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
      countyReference: countyReference
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
