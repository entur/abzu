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

import MdDeleteForver from "@mui/icons-material/DeleteForever";
import Warning from "@mui/icons-material/Warning";
import FlatButton from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { StopPlaceActions, UserActions } from "../../actions/";
import { deleteParking } from "../../actions/TiamatActions";
import * as types from "../../actions/Types";
import {
  AccessibilityLimitation as AccessibilityLimitationEnum,
  AccessibilityLimitationType,
} from "../../models/AccessibilityLimitation";
import PARKING_TYPE from "../../models/parkingType";
import { getIn } from "../../utils";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import CopyIdButton from "../Shared/CopyIdButton";
import { accessibilityLimitationsKeys } from "./AccessibilityAssessment/types";
import Code from "./Code";
import Item from "./Item";
import ItemHeader from "./ItemHeader";
import ParkingItemPayAndRideExpandedFields from "./ParkingItemPayAndRideExpandedFields";
import ToolTippable from "./ToolTippable";

class ParkingItem extends React.Component {
  state = {
    confirmDeleteDialogOpen: false,
  };

  static propTypes = {
    translations: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    expanded: PropTypes.bool.isRequired,
    parking: PropTypes.object.isRequired,
  };

  handleSetTotalCapacity(value) {
    if (value < 0) {
      value = 0;
    }
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingTotalCapacity(index, value));
  }

  handleSetName(value) {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingName(index, value));
  }

  handleSetParkingLayout(value) {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingLayout(index, value));
  }

  handleSetParkingPaymentProcess(value) {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingPaymentProcess(index, value));
  }

  handleSetRechargingAvailable(value) {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingRechargingAvailable(index, value));
  }

  handleSetNumberOfSpaces(value) {
    if (value && value < 0) {
      value = 0;
    }
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingNumberOfSpaces(index, value));
  }

  handleSetNumberOfSpacesWithRechargePoint(value) {
    if (value < 0) {
      value = 0;
    }
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changeParkingNumberOfSpacesWithRechargePoint(
        index,
        value,
      ),
    );
  }

  handleSetNumberOfSpacesForRegisteredDisabledUserType(value) {
    if (value && value < 0) {
      value = 0;
    }
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changeParkingNumberOfSpacesForRegisteredDisabledUserType(
        index,
        value,
      ),
    );
  }

  handleDeleteParking() {
    this.setState({
      confirmDeleteDialogOpen: true,
    });
  }

  handleConfirmParking() {
    const { parking, index, dispatch } = this.props;

    if (parking.id) {
      dispatch(deleteParking(parking.id)).then(() => {
        dispatch(StopPlaceActions.removeElementByType(index, "parking"));
        dispatch(UserActions.openSnackbar(types.SUCCESS));
      });
    } else {
      dispatch(StopPlaceActions.removeElementByType(index, "parking"));
    }

    this.setState({
      confirmDeleteDialogOpen: false,
    });
  }

  handleChangeCoordinates(position) {
    const { dispatch, index, handleLocateOnMap } = this.props;
    dispatch(
      StopPlaceActions.changeElementPosition(
        {
          markerIndex: index,
          type: "quay",
        },
        position,
      ),
    );
    handleLocateOnMap(position);
  }

  handleStepFreeChange(value) {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.setParkingStepFreeAccess(index, value));
  }

  render() {
    const {
      parking,
      translations,
      expanded,
      handleToggleCollapse,
      handleLocateOnMap,
      index,
      disabled,
      parkingType,
      intl,
    } = this.props;

    const { formatMessage } = intl;

    let totalCapacity = parking.totalCapacity || 0;

    const stepFreeAccess = getIn(
      parking,
      accessibilityLimitationsKeys.concat(
        AccessibilityLimitationEnum.STEP_FREE_ACCESS,
      ),
      AccessibilityLimitationType.UNKNOWN,
    );

    if (parkingType === PARKING_TYPE.PARK_AND_RIDE) {
      const numberOfSpaces = Number(parking.numberOfSpaces);
      const numberOfSpacesForRegisteredDisabledUserType = Number(
        parking.numberOfSpacesForRegisteredDisabledUserType,
      );

      if (
        !isNaN(numberOfSpaces) &&
        !isNaN(numberOfSpacesForRegisteredDisabledUserType)
      ) {
        totalCapacity =
          numberOfSpaces + numberOfSpacesForRegisteredDisabledUserType;
      } else if (!isNaN(numberOfSpaces)) {
        totalCapacity = numberOfSpaces;
      } else if (!isNaN(numberOfSpacesForRegisteredDisabledUserType)) {
        totalCapacity = numberOfSpacesForRegisteredDisabledUserType;
      }
    }

    return (
      <Item handleChangeCoordinates={this.handleChangeCoordinates}>
        <ItemHeader
          translations={translations}
          location={parking.location}
          expanded={expanded}
          handleLocateOnMap={() =>
            handleLocateOnMap(parking.location, index, "parking")
          }
          handleToggleCollapse={() => handleToggleCollapse(index, "parking")}
          handleMissingCoordinatesClick={() =>
            this.setState({ coordinatesDialogOpen: true })
          }
        >
          {formatMessage({ id: `parking_item_title_${parkingType}` })}
          {parking.hasExpired && (
            <ToolTippable
              toolTipText={formatMessage({ id: "parking_expired" })}
              toolTipStyle={{ padding: "0 5" }}
            >
              <Warning
                color="orange"
                style={{ width: 20, height: 20, marginLeft: 5 }}
              />
            </ToolTippable>
          )}
          <ToolTippable
            toolTipText={formatMessage({ id: "totalCapacity" })}
            toolTipStyle={{ padding: "0 5" }}
          >
            <Code
              type="privateCode"
              value={`${totalCapacity}`}
              defaultValue={translations.notAsssigned}
            />
          </ToolTippable>
          <span
            style={{
              fontSize: "0.8em",
              marginLeft: 5,
              fontWeight: 600,
              color: "#464545",
            }}
          >
            {parking.id}
            <CopyIdButton idToCopy={parking.id} />
          </span>
        </ItemHeader>
        {expanded && (
          <div className="pr-item-expanded">
            <TextField
              label={this.props.translations.name}
              disabled={this.props.disabled || this.props.parking.hasExpired}
              onChange={(e, v) => {
                this.handleSetName(e.target.value);
              }}
              variant="standard"
              value={this.props.parking.name}
              style={{ width: "95%", marginTop: 15, marginLeft: 5 }}
            />

            {parkingType === PARKING_TYPE.PARK_AND_RIDE ? (
              <ParkingItemPayAndRideExpandedFields
                disabled={disabled}
                hasExpired={parking.hasExpired}
                parkingLayout={parking.parkingLayout}
                parkingPaymentProcess={parking.parkingPaymentProcess}
                rechargingAvailable={parking.rechargingAvailable}
                totalCapacity={totalCapacity}
                numberOfSpaces={parking.numberOfSpaces}
                numberOfSpacesWithRechargePoint={
                  parking.numberOfSpacesWithRechargePoint
                }
                numberOfSpacesForRegisteredDisabledUserType={
                  parking.numberOfSpacesForRegisteredDisabledUserType
                }
                handleSetParkingLayout={this.handleSetParkingLayout.bind(this)}
                handleSetParkingPaymentProcess={this.handleSetParkingPaymentProcess.bind(
                  this,
                )}
                handleSetRechargingAvailable={this.handleSetRechargingAvailable.bind(
                  this,
                )}
                handleSetNumberOfSpaces={this.handleSetNumberOfSpaces.bind(
                  this,
                )}
                handleSetNumberOfSpacesWithRechargePoint={this.handleSetNumberOfSpacesWithRechargePoint.bind(
                  this,
                )}
                handleSetNumberOfSpacesForRegisteredDisabledUserType={this.handleSetNumberOfSpacesForRegisteredDisabledUserType.bind(
                  this,
                )}
                stepFreeAccess={stepFreeAccess}
                handleStepFreeChange={this.handleStepFreeChange.bind(this)}
              />
            ) : (
              <TextField
                variant="standard"
                hintText={translations.capacity}
                disabled={disabled || parking.hasExpired}
                label={translations.capacity}
                onChange={(event) => {
                  this.handleSetTotalCapacity(event.target.value);
                }}
                value={parking.totalCapacity}
                type="number"
                style={{ width: "95%", marginTop: 15, marginLeft: 5 }}
              />
            )}

            <div style={{ width: "100%", textAlign: "right" }}>
              <ToolTippable
                toolTipText={formatMessage({ id: "delete_parking" })}
                tootTipTextStyle={{ position: "relative" }}
              >
                <FlatButton
                  onClick={this.handleDeleteParking.bind(this)}
                  style={{ borderRadius: 25 }}
                >
                  <MdDeleteForver style={{ color: "#df544a" }} />
                </FlatButton>
              </ToolTippable>
            </div>
          </div>
        )}
        <ConfirmDialog
          open={this.state.confirmDeleteDialogOpen}
          handleClose={() => {
            this.setState({ confirmDeleteDialogOpen: false });
          }}
          handleConfirm={this.handleConfirmParking.bind(this)}
          intl={intl}
          messagesById={{
            title: "delete_parking",
            body: "delete_parking_are_you_sure",
            confirm: "delete_group_confirm",
            cancel: "delete_group_cancel",
          }}
        />
      </Item>
    );
  }
}

export default injectIntl(connect(null)(ParkingItem));
