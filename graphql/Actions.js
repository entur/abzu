import {
  mutateDeleteQuay,
  mutateDeleteStopPlace,
  mutateMergeQuays
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

export const mergeQuays = (client, stopPlaceId, fromQuayId, toQuayId) =>
  client.mutate({
    mutation: mutateMergeQuays,
    variables: {
      stopPlaceId,
      fromQuayId,
      toQuayId
    }
  });

export const getStopPlaceWithAll = (client, stopPlaceId) => (
  client.query({
    query: stopPlaceWithEverythingElse,
    variables: {
      stopPlaceId
    }
  })
);
