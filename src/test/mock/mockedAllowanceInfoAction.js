export const mockedAllowanceInfoAction = function (stopPlace, token) {
  return {
    result: stopPlace,
    variables: {
      id: stopPlace.id,
    },
  };
};
