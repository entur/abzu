import RoleParser from "../roles/rolesParser";

export const isLegalChildStopPlace = (
  stopPlace,
  roleAssignments,
  fetchedPolygons,
  allowNewStopEverywhere,
) => {
  if (!stopPlace) {
    return false;
  }

  const editStopRoles = RoleParser.getEditStopRoles(roleAssignments);
  const editStopRolesGeoFiltered = RoleParser.filterRolesByZoneRestriction(
    editStopRoles,
    stopPlace.location,
    fetchedPolygons,
    allowNewStopEverywhere,
  );
  const responsibleEditRoles = RoleParser.filterByEntities(
    editStopRolesGeoFiltered,
    stopPlace,
  );
  const isLegal = responsibleEditRoles.length > 0;
  return isLegal;
};
