// determines whether a stopPlace has expired based on validBetweens
export const hasExpired = validBetweens => {
  try {
    if (!validBetweens || !validBetweens.length) return false;

    let validBetweenDates = validBetweens[0];

    if (validBetweenDates.toDate === null) return true;

    let toDate = new Date(validBetweenDates.toDate);
    let nowDate = new Date();

    return toDate >= nowDate;
  } catch (e) {
    console.error('invalid date format', validBetweens.toDate);
    return false;
  }
};
