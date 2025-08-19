/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import { ComponentToggle } from "@entur/react-component-toggle";
import { divIcon } from "leaflet";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { connect } from "react-redux";
import { StopPlaceActions, UserActions } from "../../actions/";
import compassIcon from "../../static/icons/compass.png";
import OSMIcon from "../../static/icons/osm_logo.png";
import StreetViewIcon from "../../static/icons/street_view_logo.png";
import { getIn } from "../../utils/";
import Code from "../EditStopPage/Code";
import CopyIdButton from "../Shared/CopyIdButton";
import PopupButton from "./PopupButton";
import QuayMarkerIcon from "./QuayMarkerIcon";
import { compareShallowQuayMarker as shallowCompare } from "./shallowCompare/";

class QuayMarker extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    id: PropTypes.string,
    stopPlaceId: PropTypes.string,
    stopPlaceName: PropTypes.string.isRequired,
    position: PropTypes.arrayOf(Number),
    publicCode: PropTypes.string.isRequired,
    privateCode: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    handleQuayDragEnd: PropTypes.func.isRequired,
    formattedStopType: PropTypes.string.isRequired,
    handleUpdatePathLink: PropTypes.func.isRequired,
    isCreatingPolylines: PropTypes.bool.isRequired,
    handleChangeCoordinates: PropTypes.func,
    draggable: PropTypes.bool.isRequired,
    handleSetCompassBearing: PropTypes.func,
  };

  getOSMURL() {
    const { position } = this.props;
    return `https://www.openstreetmap.org/edit#map=18/${position[0]}/${position[1]}`;
  }

  getStreetViewURL() {
    const { position } = this.props;
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position[0]},${position[1]}`;
  }

  handleMergeFrom() {
    const { id, dispatch } = this.props;
    dispatch(UserActions.startMergingQuayFrom(id));
  }

  handleMergeTo() {
    const { id, dispatch } = this.props;
    dispatch(UserActions.endMergingQuayTo(id));
  }

  handleCancelMerge() {
    this.props.dispatch(UserActions.cancelMergingQuayFrom());
  }

  handleSetFocus() {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.setElementFocus(index, "quay"));
    const expandedQuayEl = document.querySelector(".quay-item-expanded");
    const scrollBodyEl = document.querySelector("#scroll-body");
    if (expandedQuayEl && scrollBodyEl) {
      expandedQuayEl.scrollIntoView(true);
      scrollBodyEl.scrollTop -= 50;
    }
  }

  handleMoveQuay() {
    this.props.dispatch(
      UserActions.moveQuay({
        id: this.props.id,
        privateCode: this.props.privateCode,
        publicCode: this.props.publicCode,
      }),
    );
  }

  handleMoveQuayToNewStop() {
    this.props.dispatch(
      UserActions.moveQuayToNewStopPlace({
        id: this.props.id,
        privateCode: this.props.privateCode,
        publicCode: this.props.publicCode,
        stopPlaceId: this.props.stopPlaceId,
      }),
    );
  }

  shouldComponentUpdate(nextProps) {
    return shallowCompare(this.props, nextProps);
  }

  getShouldShowMergeQuay() {
    const {
      isEditingStop,
      disabled,
      belongsToNeighbourStop,
      currentIsNewStop,
      id,
    } = this.props;
    return (
      isEditingStop &&
      !disabled &&
      !belongsToNeighbourStop &&
      !!id &&
      !currentIsNewStop
    );
  }

  getIsMergingFromThis() {
    const { id, mergingQuay } = this.props;
    return (
      id &&
      mergingQuay.fromQuay &&
      mergingQuay.fromQuay.id &&
      id === mergingQuay.fromQuay.id
    );
  }

  getShouldShowMoveQuay() {
    const {
      isEditingStop,
      disabled,
      belongsToNeighbourStop,
      currentIsNewStop,
      id,
      currentStopIsMultimodal,
    } = this.props;

    return (
      isEditingStop &&
      !disabled &&
      belongsToNeighbourStop &&
      !!id &&
      !currentIsNewStop &&
      !currentStopIsMultimodal
    );
  }

  getHideMergingTo() {
    const isMergingFromThis = this.getIsMergingFromThis();
    const shouldShowMergeQuay = this.getShouldShowMergeQuay();
    const { mergingQuay } = this.props;
    const isAllowed =
      !isMergingFromThis && shouldShowMergeQuay && mergingQuay.isMerging;
    return !isAllowed;
  }

  getHideMergingFrom() {
    const isMergingFromThis = this.getIsMergingFromThis();
    const shouldShowMergeQuay = this.getShouldShowMergeQuay();
    const { mergingQuay } = this.props;
    const isAllowed =
      shouldShowMergeQuay && !isMergingFromThis && !mergingQuay.isMerging;
    return !isAllowed;
  }

  getCancelMergingFromThis() {
    const isMergingFromThis = this.getIsMergingFromThis();
    const shouldShowMergeQuay = this.getShouldShowMergeQuay();
    const { mergingQuay } = this.props;
    const isAllowed =
      shouldShowMergeQuay && isMergingFromThis && mergingQuay.isMerging;
    return !isAllowed;
  }

  render() {
    const {
      position,
      privateCode,
      publicCode,
      index,
      handleQuayDragEnd,
      stopPlaceName,
      formattedStopType,
      handleUpdatePathLink,
      translations,
      handleChangeCoordinates,
      belongsToNeighbourStop,
      isEditingStop,
      currentIsNewStop,
      isCreatingPolylines,
      id,
      pathLink,
      showPathLink,
      disabled,
      showPublicCode,
    } = this.props;

    if (!position) return null;

    let isIncomplete = false;

    let pathLinkText = isCreatingPolylines
      ? translations.terminatePathLinkHere
      : translations.createPathLinkHere;

    if (isCreatingPolylines && pathLink && pathLink.length) {
      let lastPathLink = pathLink[pathLink.length - 1];
      let fromId = getIn(
        lastPathLink,
        ["from", "placeRef", "addressablePlace", "id"],
        null,
      );

      if (fromId === id) {
        pathLinkText = translations.cancelPathLink;
      } else {
        // LineString should either have 0 or >= 2 [long,lat] according to GeoJSON spec
        if (lastPathLink.inBetween && lastPathLink.inBetween.length === 1) {
          isIncomplete = true;
        }
      }
    }

    const displayCode = showPublicCode ? publicCode : privateCode;

    const divBody = ReactDOM.renderToStaticMarkup(
      <QuayMarkerIcon
        isEditingStop={isEditingStop}
        index={index}
        displayCode={displayCode}
        focusedElement={this.props.focusedElement}
        compassBearing={this.props.compassBearing}
        isCompassBearingEnabled={this.props.isCompassBearingEnabled}
        belongsToNeighbourStop={belongsToNeighbourStop}
        defaultValueIcon={translations.notAssigned}
      />,
    );

    let quayIcon = divIcon({
      html: divBody,
      iconSize: [22, 34],
      iconAnchor: [11, 34],
      popupAnchor: [5, 0],
    });

    const osmURL = this.getOSMURL();
    const streetViewURL = this.getStreetViewURL();
    const shouldShowMoveQuay = this.getShouldShowMoveQuay();
    const hideMergingTo = this.getHideMergingTo();
    const hideMergingFrom = this.getHideMergingFrom();
    const hideCancelMergingFromThis = this.getCancelMergingFromThis();

    return (
      <Marker
        position={position}
        icon={quayIcon}
        draggable={this.props.draggable}
        eventHandlers={{
          dragend: (e) => handleQuayDragEnd(index, "quay", e),
          popupopen: () => {
            this.handleSetFocus();
          },
        }}
        keyboard={false}
      >
        <Popup autoPan={false}>
          <div>
            <span className="quay-marker-title marker-title--override">
              {stopPlaceName}
            </span>
            <div
              className="quay-marker-title"
              style={{
                marginTop: -2,
                marginBottom: 5,
                fontSize: "1em",
                color: "#191919",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>{formattedStopType}</div>
              <Code
                type="publicCode"
                value={publicCode}
                defaultValue={translations.notAssigned}
              />
              <Code
                type="privateCode"
                value={privateCode}
                defaultValue={translations.notAssigned}
              />
            </div>
            <div className="marker-popup-id">
              {id}
              <CopyIdButton idToCopy={id} />
            </div>
            <div
              className="marker-popup-change-coordinates-wrapper"
              onClick={() =>
                !belongsToNeighbourStop &&
                handleChangeCoordinates(
                  { type: "quay", markerIndex: index },
                  position,
                )
              }
            >
              <span
                style={{
                  display: "inline-block",
                  textAlign: "center",
                  borderBottom: !belongsToNeighbourStop
                    ? "1px dotted black"
                    : "none",
                }}
              >
                {position[0]}
              </span>
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 3,
                  borderBottom: !belongsToNeighbourStop
                    ? "1px dotted black"
                    : "none",
                }}
              >
                {position[1]}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              {belongsToNeighbourStop || !this.props.draggable ? null : (
                <div
                  onClick={() => {
                    this.props.handleSetCompassBearing(
                      this.props.compassBearing,
                      index,
                    );
                  }}
                >
                  <img
                    alt=""
                    style={{ width: 20, height: 22, cursor: "pointer" }}
                    src={compassIcon}
                  />
                </div>
              )}
              <div
                style={{
                  marginLeft: belongsToNeighbourStop ? 0 : 10,
                  cursor: "pointer",
                }}
              >
                <a href={osmURL} target="_blank" rel="noopener noreferrer">
                  <img
                    alt=""
                    style={{
                      width: 20,
                      height: 22,
                      border: "1px solid grey",
                      borderRadius: 50,
                    }}
                    src={OSMIcon}
                  />
                </a>
              </div>
              <div
                style={{
                  marginLeft: belongsToNeighbourStop ? 0 : 10,
                  cursor: "pointer",
                }}
              >
                <a
                  href={streetViewURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt=""
                    style={{
                      width: 20,
                      height: 22,
                      border: "1px solid grey",
                      borderRadius: 50,
                    }}
                    src={StreetViewIcon}
                  />
                </a>
              </div>
              <ComponentToggle
                feature="SVVStreetViewLink"
                componentProps={{
                  position,
                  skipMarginLeft: belongsToNeighbourStop,
                }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <PopupButton
                hidden={!shouldShowMoveQuay}
                onClick={() => this.handleMoveQuay()}
                label={translations.moveQuayToCurrent}
              />
              <div style={{ textAlign: "center" }}>
                <PopupButton
                  hidden={hideCancelMergingFromThis}
                  onClick={() => this.handleCancelMerge()}
                  label={translations.mergeQuayCancel}
                />
                <PopupButton
                  hidden={hideMergingTo}
                  onClick={() => this.handleMergeTo()}
                  label={translations.mergeQuayTo}
                />
                <PopupButton
                  hidden={hideMergingFrom}
                  onClick={() => this.handleMergeFrom()}
                  label={translations.mergeQuayFrom}
                />
                {!disabled &&
                  isEditingStop &&
                  !this.props.currentStopIsMultimodal &&
                  id && (
                    <div style={{ marginTop: 10 }}>
                      <span
                        className="marker-popup-button"
                        onClick={this.handleMoveQuayToNewStop.bind(this)}
                      >
                        {translations.moveQuaysToNewStop}
                      </span>
                    </div>
                  )}
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              {false && isEditingStop && !currentIsNewStop ? ( // change false to showPathLink to revert thjs change
                <div>
                  {id ? (
                    <div
                      className={`marker-popup-button ${
                        isIncomplete ? "incomplete" : ""
                      }`}
                      onClick={() => {
                        handleUpdatePathLink(position, id, "quay");
                      }}
                    >
                      {pathLinkText}
                      {isIncomplete && <div>{translations.inComplete}</div>}
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 10,
                        border: "1px solid #9E9E9E",
                      }}
                    >
                      {translations.saveFirstPathLink}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }
}

const mapStateToProps = (state) => ({
  isCreatingPolylines: state.stopPlace.isCreatingPolylines,
  showPublicCode: state.user.showPublicCode,
  isCompassBearingEnabled: state.stopPlace.isCompassBearingEnabled,
  focusedElement: state.mapUtils.focusedElement,
  mergingQuay: state.mapUtils.mergingQuay,
  pathLink: state.stopPlace.pathLink,
  currentStopIsMultimodal: getIn(
    state,
    ["stopPlace", "current", "isParent"],
    false,
  ),
});

export default connect(mapStateToProps)(QuayMarker);
