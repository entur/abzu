import {
  mutateDeleteQuay,
  mutateDeleteStopPlace,
  mutateMergeQuays,
  mutateMergeStopPlaces,
  mutateMoveQuaysToStop
} from './Mutations';
import {
  allVersionsOfStopPlace,
  stopPlaceWithEverythingElse,
  stopPlaceBBQuery
} from '../graphql/Queries';

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
    query: stopPlaceWithEverythingElse,
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
)
