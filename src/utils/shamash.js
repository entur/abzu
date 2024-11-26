const getShamashBaseUrl = () =>
  window.config.OTPUrl.replace(
    "/journey-planner/v3/graphql",
    "/graphql-explorer/journey-planner",
  );

export const getQuaySearchUrl = (id) => {
  const encodedId = encodeURI(id);

  const query = `%7Bquay%28id%3A%22${encodedId}%22%29%7Bname%20id%20publicCode%20journeyPatterns%7BserviceJourneys%7Bid%20privateCode%20line%7Bid%20publicCode%7DtransportMode%20activeDates%7D%7D%7D%7D&variables=`;
  return `${getShamashBaseUrl()}?query=${query}`;
};

export const getStopPlaceSearchUrl = (id) => {
  const encodedId = encodeURI(id);
  const query = `%7BstopPlace%28id%3A%22${encodedId}%22%29%7Bname%20quays%7Bid%20lines%7Bid%20publicCode%20serviceJourneys%7Bid%20activeDates%7D%7D%7D%7D%7D&variables=`;
  return `${getShamashBaseUrl()}?query=${query}`;
};
