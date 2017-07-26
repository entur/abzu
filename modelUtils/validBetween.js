// determines whether an entity has expired based on validBetweens
export const hasExpired = validBetween => {

  if (!validBetween) return false;

  if (validBetween.toDate === null) return false;

  let toDate = new Date(validBetween.toDate);
  let nowDate = new Date();

  return toDate <= nowDate;
};
