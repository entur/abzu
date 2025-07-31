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

import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { StopPlaceActions } from "../../actions";
import { setDecimalPrecision } from "../../utils";
import ConfirmDialog from "../Dialogs/ConfirmDialog";

import newStopIcon from "../../static/icons/new-stop-icon-2x.png";
import bikeParkingIcon from "../../static/icons/pin-50x82-blue-bikepark.png";
import parkAndRideIcon from "../../static/icons/pin-50x82-blue-parkAndRide.png";
import boardingPositionIcon from "../../static/icons/pin-50x82-purple-boardingPosition.png";
import quayIcon from "../../static/icons/pin-50x82-red-quay.png";

class NewElementsBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDialogOpen: false,
    };
    this.refs = {};
  }

  handleDialogClose() {
    this.setState({
      confirmDialogOpen: false,
      owner: null,
    });
  }

  handleConfirmSubmit() {
    const { owner } = this.state;
    this.props.dispatch(
      StopPlaceActions.addElementToStop(owner.key, owner.latlng),
    );
    this.handleDialogClose();
  }
  render() {
    const { formatMessage } = this.props.intl;
    const { activeStopPlace, missingCoordsMap, disabled, focusedElement } =
      this.props;

    const boxWrapperStyle = {
      zIndex: 999,
      fontSize: 10,
      textAlign: "center",
      position: "absolute",
      width: "auto",
      marginLeft: "41%",
      top: 5,
      color: "#fff",
    };

    const elementStyle = {
      display: "inline-block",
      cursor: disabled ? "not-allowed" : "move",
      margin: "5px 15px",
    };

    const titleStyle = {
      textTransform: "capitalize",
      marginTop: 5,
    };

    const quayText = formatMessage({ id: "quay" });
    const newStopText = formatMessage({ id: "stop_place" });
    const parkAndRideText = formatMessage({
      id: "parking_item_title_short_parkAndRide",
    });
    const bikeParkingText = formatMessage({
      id: "parking_item_title_bikeParking",
    });

    const boardingPositionsText = formatMessage({
      id: "boarding_positions_title",
    });

    let shouldShowNewStop = true;

    if (
      activeStopPlace &&
      (activeStopPlace.location || missingCoordsMap[activeStopPlace.id])
    ) {
      shouldShowNewStop = false;
    }

    const shouldShowNewBoardingPosition =
      focusedElement.type === "quay" && focusedElement.index > -1;

    return (
      <div style={boxWrapperStyle}>
        <ConfirmDialog
          open={this.state.confirmDialogOpen}
          intl={this.props.intl}
          messagesById={{
            title: "add_new_element_title",
            body: "add_new_element_body",
            confirm: "add_new_element_confirm",
            cancel: "add_new_element_cancel",
          }}
          handleClose={this.handleDialogClose.bind(this)}
          handleConfirm={this.handleConfirmSubmit.bind(this)}
        />

        <div style={{ marginTop: 0, marginBottom: 0 }}>
          {shouldShowNewStop ? (
            <div style={elementStyle}>
              <img
                alt=""
                ref={(ref) => {
                  if (ref) this.refs.stop_place = ref;
                }}
                id="drag-stop-place"
                data-type="stop_place"
                draggable
                style={{
                  height: 25,
                  width: "auto",
                  marginLeft: newStopText.length,
                }}
                src={newStopIcon}
              />
              <div
                className={"new-map-element-text--override"}
                style={titleStyle}
              >
                {newStopText}
              </div>
            </div>
          ) : null}
          <div style={elementStyle}>
            <img
              alt=""
              id="drag-quay"
              data-type="quay"
              ref={(ref) => {
                if (ref) this.refs.quay = ref;
              }}
              draggable="true"
              style={{ height: 25, width: "auto", marginLeft: 0 }}
              src={quayIcon}
            />
            <div
              className={"new-map-element-text--override"}
              style={titleStyle}
            >
              {quayText}
            </div>
          </div>
          <div
            style={{
              ...elementStyle,
              display: shouldShowNewBoardingPosition ? "inline-block" : "none",
            }}
          >
            <img
              alt=""
              id="drag-boarding-position"
              data-type="boardingPosition"
              ref={(ref) => {
                if (ref) this.refs.boardingPosition = ref;
              }}
              draggable="true"
              style={{ height: 25, width: "auto", marginLeft: 0 }}
              src={boardingPositionIcon}
            />
            <div
              className={"new-map-element-text--override"}
              style={titleStyle}
            >
              {boardingPositionsText}
            </div>
          </div>
          <div style={elementStyle}>
            <img
              alt=""
              ref={(ref) => {
                if (ref) this.refs.parkAndRide = ref;
              }}
              data-type="parkAndRide"
              id="drag-park-and-ride"
              draggable
              style={{ height: 25, width: "auto", marginLeft: 0 }}
              src={parkAndRideIcon}
            />
            <div
              className={"new-map-element-text--override"}
              style={titleStyle}
            >
              {parkAndRideText}
            </div>
          </div>
          <div style={elementStyle}>
            <img
              alt=""
              ref={(ref) => {
                if (ref) this.refs.bikeParking = ref;
              }}
              data-type="bikeParking"
              id="drag-bike-parking"
              draggable
              style={{ height: 25, width: "auto", marginLeft: 0 }}
              src={bikeParkingIcon}
            />
            <div
              className={"new-map-element-text--override"}
              style={titleStyle}
            >
              {bikeParkingText}
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!this.props.disabled) {
      Object.keys(this.refs).forEach((key) => {
        const ref = this.refs[key];
        const type = ref.getAttribute("data-type");

        if (ref.draggable) {
          const draggable = new window.L.Draggable(ref);

          draggable.addEventListener("dragend", (event) => {
            // prevent adding to map if distance is too short (i.e. a mistake)
            if (event.distance < 50) {
              window.L.DomUtil.setPosition(ref, window.L.point(0, 0));
              return;
            }

            const { activeMap } = this.props;
            const { target } = event;
            const position = target._newPos;
            const widthOffset = -12;
            const heightOffset = -45;

            const xPos =
              target._startPoint.x +
              position.x -
              target._startPos.x +
              widthOffset;
            const yPos =
              target._startPoint.y +
              position.y -
              target._startPos.y +
              heightOffset;

            const absolutePosition = new window.L.Point(xPos, yPos);

            const { lat, lng } =
              activeMap.containerPointToLatLng(absolutePosition);

            const latlng = [
              setDecimalPrecision(lat, 6),
              setDecimalPrecision(lng, 6),
            ];

            this.setState({
              confirmDialogOpen: true,
              owner: {
                key: type,
                latlng: latlng,
              },
            });

            window.L.DomUtil.setPosition(ref, window.L.point(0, 0));
          });
          draggable.enable();
        }
      });
    }
  }
}

const mapStateToProps = (state) => ({
  isMultiPolylinesEnabled: state.stopPlace.enablePolylines,
  isCompassBearingEnabled: state.stopPlace.isCompassBearingEnabled,
  activeMap: state.mapUtils.activeMap,
  missingCoordsMap: state.user.missingCoordsMap,
  activeStopPlace: state.stopPlace.current,
  focusedElement: state.mapUtils.focusedElement,
});

export default injectIntl(connect(mapStateToProps)(NewElementsBox));
