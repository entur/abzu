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

import classNames from "classnames";
import L from "leaflet";
import PropTypes from "prop-types";
import { Component } from "react";
import { Marker, Popup } from "react-leaflet";
import { connect } from "react-redux";
import { StopPlaceActions } from "../../actions/";
import { getPrimaryDarkerColor } from "../../config/themeConfig";
import CycleParkingIcon from "../../static/icons/cycle-parking-icon.png";
import CopyIdButton from "../Shared/CopyIdButton";
import { shallowCycleParkingMarker as shallowCompare } from "./shallowCompare/";

class CycleParkingMarker extends Component {
  static propTypes = {
    position: PropTypes.arrayOf(PropTypes.number),
    index: PropTypes.number.isRequired,
    hasExpired: PropTypes.bool.isRequired,
    handleDragEnd: PropTypes.func.isRequired,
    translations: PropTypes.shape({
      title: PropTypes.string.isRequired,
      totalCapacity: PropTypes.string.isRequired,
      totalCapacityUnknown: PropTypes.string.isRequired,
    }).isRequired,
  };

  handleSetFocus() {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.setElementFocus(index, "parking"));
    const item = document.querySelector(".pr-item-expanded");
    if (item) {
      item.scrollIntoView(true);
    }
    const body = document.querySelector("#scroll-body");
    if (body) {
      body.scrollTop -= 50;
    }
  }

  shouldComponentUpdate(nextProps) {
    return shallowCompare(this.props, nextProps);
  }

  render() {
    const {
      position,
      id,
      index,
      type,
      handleDragEnd,
      translations,
      name,
      hasExpired,
      totalCapacity,
      draggable,
      focusedElement,
    } = this.props;

    if (!position) return null;

    const isFocused =
      focusedElement?.type === type && index === focusedElement?.index;

    const icon = L.icon({
      iconUrl: CycleParkingIcon,
      iconSize: [20, 30],
      iconAnchor: [10, 30],
      popupAnchor: [0, 15],
      className: classNames({
        expired: hasExpired,
        focused: isFocused,
      }),
    });

    return (
      <Marker
        draggable={draggable}
        position={position}
        icon={icon}
        key={"parking-marker" + index}
        eventHandlers={{
          dragend: (e) => handleDragEnd(index, "parking", e),
        }}
      >
        <Popup
          autoPan={false}
          eventHandlers={{
            popupopen: () => {
              this.handleSetFocus();
            },
          }}
        >
          <div>
            <div
              style={{
                marginTop: 10,
                fontWeight: 600,
                color: "red",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {hasExpired && translations.parkingExpired}
            </div>
            <div
              className={"marker-title--override"}
              style={{
                fontWeight: 600,
                textAlign: "center",
                margin: "5 0",
                fontSize: "1.1em",
                color: getPrimaryDarkerColor(),
              }}
            >
              {name}
            </div>
            <div
              style={{
                marginTop: -2,
                textAlign: "center",
                marginBottom: 5,
                fontWeight: 600,
                fontSize: "1em",
              }}
            >
              {translations.title}{" "}
            </div>
            <div>
              {id}
              <CopyIdButton idToCopy={id} />
            </div>
            <div
              style={{
                marginTop: -2,
                marginBottom: 5,
                fontSize: "1em",
                color: "#191919",
              }}
            >
              {translations.totalCapacity}:
              <span
                style={{
                  fontStyle:
                    typeof totalCapacity === "number" ? "normal" : "italic",
                  marginLeft: 1,
                }}
              >
                {typeof totalCapacity === "number"
                  ? totalCapacity
                  : translations.totalCapacityUnknown}
              </span>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }
}

const mapStateToProps = (state) => ({
  focusedElement: state.mapUtils.focusedElement,
});

export default connect(mapStateToProps)(CycleParkingMarker);
