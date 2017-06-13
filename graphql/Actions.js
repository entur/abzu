import {
  mutateDeleteQuay,
  mutateDeleteStopPlace,
  mutateMergeQuays,
  mutateMergeStopPlaces
} from './Mutations';
import {
  stopPlaceAndPathLinkByVersion,
  allVersionsOfStopPlace,
  stopPlaceWithEverythingElse
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

export const mergeQuays = (client, stopPlaceId, fromQuayId, toQuayId) =>
  client.mutate({
    mutation: mutateMergeQuays,
    variables: {
      stopPlaceId,
      fromQuayId,
      toQuayId
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

export const mergeQuaysFromStop = (client, fromStopPlaceId, toStopPlaceId) => (
  client.mutate({
    mutation: mutateMergeStopPlaces,
    variables: {
      fromStopPlaceId,
      toStopPlaceId
    },
    fetchPolicy: 'network-only'
  })
)