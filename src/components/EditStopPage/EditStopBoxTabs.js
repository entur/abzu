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
import QuayItem from "./QuayItem";
import ParkingItem from "./ParkingItem";
import { connect } from "react-redux";
import { StopPlaceActions, UserActions } from "../../actions/";
import { CodeBadge } from "./Code";
import MdSortByAlpha from "@mui/icons-material/SortByAlpha";

class EditStopBoxTabs extends React.Component {
  handleLocateOnMap(position, index, type) {
    this.props.dispatch(StopPlaceActions.changeMapCenter(position, 17));
    this.props.dispatch(StopPlaceActions.setElementFocus(index, type));
  }

  handleRemoveQuay(index, quayId) {
    const { dispatch, activeStopPlace } = this.props;
    if (!quayId) {
      dispatch(StopPlaceActions.removeElementByType(index, "quay"));
    } else {
      const quayImportedId = activeStopPlace.quays.find(
        (quay) => quay.id === quayId,
      ).importedId;
      dispatch(
        UserActions.requestDeleteQuay(
          activeStopPlace.id,
          quayId,
          quayImportedId,
        ),
      );
    }
  }

  handleOpenKeyValuesDialog(keyValues, type, index) {
    this.props.dispatch(
      UserActions.openKeyValuesDialog(keyValues, type, index),
    );
  }

  handleSortQuays(attribute) {
    this.props.dispatch(StopPlaceActions.sortQuays(attribute));
  }

  handleToggleCollapse(index, type) {
    const { dispatch, expandedItem } = this.props;
    const isExpanded =
      expandedItem.type === type && expandedItem.index === index;
    dispatch(StopPlaceActions.setElementFocus(isExpanded ? -1 : index, type));
  }

  getQuayItems(
    activeStopPlace,
    expandedItem,
    itemTranslation,
    noElementsStyle,
    disabled,
  ) {
    return activeStopPlace.quays.length ? (
      activeStopPlace.quays.map((quay, index) => (
        <QuayItem
          key={"quay-" + index}
          quay={quay}
          disabled={disabled}
          index={index}
          publicCode={quay.publicCode}
          handleRemoveQuay={() => this.handleRemoveQuay(index, quay.id)}
          handleOpenKeyValuesDialog={() =>
            this.handleOpenKeyValuesDialog(quay.keyValues, "quay", index)
          }
          handleLocateOnMap={this.handleLocateOnMap.bind(this)}
          handleToggleCollapse={this.handleToggleCollapse.bind(this)}
          stopPlaceType={activeStopPlace.stopPlaceType}
          expanded={
            expandedItem.type === "quay" && index === expandedItem.index
          }
        />
      ))
    ) : (
      <div style={noElementsStyle}>
        {itemTranslation.none} {itemTranslation.quays}
      </div>
    );
  }

  getParkingElements(
    activeStopPlace,
    expandedItem,
    itemTranslation,
    noElementsStyle,
    disabled,
  ) {
    return activeStopPlace.parking.length ? (
      activeStopPlace.parking.map((parking, index) => {
        const parkingType = parking.parkingType;
        return (
          <ParkingItem
            translations={itemTranslation}
            key={"parking-" + index}
            disabled={disabled}
            index={index}
            parking={parking}
            parkingType={parkingType}
            handleLocateOnMap={this.handleLocateOnMap.bind(this)}
            handleToggleCollapse={this.handleToggleCollapse.bind(this)}
            expanded={
              expandedItem.type === "parking" && index === expandedItem.index
            }
          />
        );
      })
    ) : (
      <div style={{ ...noElementsStyle, textTransform: "lowercase" }}>
        {itemTranslation.none} {itemTranslation.parking}
      </div>
    );
  }

  render() {
    const noElementsStyle = {
      fontStyle: "italic",
      marginTop: 100,
      textAlign: "center",
      fontSize: "0.8em",
    };

    const tabContainerStyle = {
      height: 220,
      position: "relative",
      display: "block",
    };

    const {
      activeElementTab,
      itemTranslation,
      activeStopPlace,
      expandedItem,
      disabled,
    } = this.props;

    return (
      <div style={tabContainerStyle}>
        {activeElementTab === 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 10,
            }}
          >
            <div
              style={{ cursor: "pointer", marginLeft: 5 }}
              onClick={() => this.handleSortQuays("publicCode")}
            >
              <CodeBadge
                icon={<MdSortByAlpha style={{ width: 14, height: 14 }} />}
                type="publicCode"
              />
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => this.handleSortQuays("privateCode")}
            >
              <CodeBadge
                icon={
                  <MdSortByAlpha
                    style={{ width: 14, height: 14, color: "#fff" }}
                  />
                }
                type="privateCode"
              />
            </div>
          </div>
        )}
        {activeElementTab === 0
          ? this.getQuayItems(
              activeStopPlace,
              expandedItem,
              itemTranslation,
              noElementsStyle,
              disabled,
            )
          : null}
        {activeElementTab === 1
          ? this.getParkingElements(
              activeStopPlace,
              expandedItem,
              itemTranslation,
              noElementsStyle,
              disabled,
            )
          : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeElementTab: state.user.activeElementTab,
  expandedItem: state.mapUtils.focusedElement,
});

export default connect(mapStateToProps)(EditStopBoxTabs);
