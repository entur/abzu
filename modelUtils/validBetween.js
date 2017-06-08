// determines whether a stopPlace has expired based on validBetweens
export const hasExpired = validBetween => {
  try {
    if (!validBetween) return false;

    if (validBetween.toDate === null) return true;

    let toDate = new Date(validBetween.toDate);
    let nowDate = new Date();

    return toDate >= nowDate;
  } catch (e) {
    console.error('invalid date format', validBetween.toDate);
    return false;
  }
};
