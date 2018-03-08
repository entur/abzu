import { createOTPClient } from '../clients';
import { findStopPlaceUsage } from './queries';

export const checkStopPlaceUsage = stopPlaceId => {
  const client = createOTPClient();
  return client.query({
    fetchPolicy: 'network-only',
    query: findStopPlaceUsage,
    variables: {
      stopPlaceId
    }
  });
};
