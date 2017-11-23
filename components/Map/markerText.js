export const popupMarkerText = formatMessage => ({
    untitled: formatMessage({ id: 'untitled' }),
    coordinates: formatMessage({ id: 'coordinates' }),
    createPathLinkHere: formatMessage({ id: 'create_path_link_here' }),
    terminatePathLinkHere: formatMessage({ id: 'terminate_path_link_here' }),
    cancelPathLink: formatMessage({ id: 'cancel_path_link' }),
    showQuays: formatMessage({ id: 'show_quays' }),
    hideQuays: formatMessage({ id: 'hide_quays' }),
    inComplete: formatMessage({ id: 'path_link_incomplete' }),
    saveFirstPathLink: formatMessage({ id: 'save_first_path_link' }),
    mergeStopPlace: formatMessage({ id: 'merge_stop_here' }),
    mergeQuayFrom: formatMessage({ id: 'merge_quay_from' }),
    mergeQuayTo: formatMessage({ id: 'merge_quay_to' }),
    mergeQuayCancel: formatMessage({ id: 'merge_quay_cancel' }),
    expired: formatMessage({ id: 'has_expired'}),
    publicCode: formatMessage({id: 'publicCode'}),
    privateCode: formatMessage({id: 'privateCode'}),
    moveQuayToCurrent: formatMessage({id: 'move_quay_to_current'}),
    moveQuaysToNewStop: formatMessage({id: 'move_quays_to_new_stop'}),
    adjustCentroid: formatMessage({id: 'adjust_centroid'}),
    createMultimodal: formatMessage({id: 'new__multi_stop'}),
    addToGroup: formatMessage({id: 'add_to_group'}),
    removeFromGroup: formatMessage({id: 'remove_from_group'}),
    createGOS: formatMessage({id: 'create_group_of_stop_places'})
  });

export const newStopPlaceMarkerText = formatMessage => ({
  newStopTitle: formatMessage({ id: 'new_stop_title' }),
  newParentStopTitle: formatMessage({ id: 'new_parent_stop_title' }),
  newParentStopQuestion: formatMessage({ id: 'new_parent_stop_question' }),
  newStopQuestion: formatMessage({ id: 'new_stop_question' }),
  createNow: formatMessage({ id: 'create_now' }),
  createNotAllowed: formatMessage({id: 'create_not_allowed'})
});