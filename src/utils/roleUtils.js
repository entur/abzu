import RoleParser from "../roles/rolesParser";

export const isLegalChildStopPlace = (
  stopPlace,
  tokenParsed,
  fetchedPolygons,
  allowNewStopEverywhere
) => {
  if (!stopPlace) {
    return false;
  }

  const token = { ...tokenParsed };
  const editStopRoles = RoleParser.getEditStopRoles(token);
  const editStopRolesGeoFiltered = RoleParser.filterRolesByZoneRestriction(
    editStopRoles,
    stopPlace.location,
    fetchedPolygons,
    allowNewStopEverywhere
  );
  const responsibleEditRoles = RoleParser.filterByEntities(
    editStopRolesGeoFiltered,
    stopPlace
  );
  const isLegal = responsibleEditRoles.length > 0;
  return isLegal;
};
