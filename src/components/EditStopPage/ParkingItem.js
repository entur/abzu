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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StopPlaceActions, UserActions } from '../../actions/';
import Warning from 'material-ui/svg-icons/alert/warning';
import MdDeleteForver from 'material-ui/svg-icons/action/delete-forever';
import ToolTippable from './ToolTippable';
import { injectIntl } from 'react-intl';
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import { withApollo } from 'react-apollo';
import { deleteParking } from '../../graphql/Tiamat/actions';
import * as types from "../../actions/Types";
import {FlatButton} from "material-ui";
import TextField from 'material-ui/TextField';
import ParkingItemPayAndRideExpandedFields from './ParkingItemPayAndRideExpandedFields';
import ItemHeader from './ItemHeader';
import Item from './Item';
import Code from './Code';
import PARKING_TYPE from '../../models/parkingType';

class ParkingItem extends React.Component {

  state = {
    confirmDeleteDialogOpen: false
  };

  static propTypes = {
    translations: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    expanded: PropTypes.bool.isRequired,
    parking: PropTypes.object.isRequired
  };

  handleSetTotalCapacity(value) {
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
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingNumberOfSpaces(index, value));
  }

  handleSetNumberOfSpacesWithRechargePoint(value) {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingNumberOfSpacesWithRechargePoint(index, value));
  }

  handleSetNumberOfSpacesForRegisteredDisabledUserType(value) {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingNumberOfSpacesForRegisteredDisabledUserType(index, value));
  }

  handleDeleteParking() {
    this.setState({
      confirmDeleteDialogOpen: true
    });
  }

  handleConfirmParking() {
    const { parking, index, dispatch, client } = this.props;

    if (parking.id) {
      deleteParking(client, parking.id).then(() => {
        dispatch(StopPlaceActions.removeElementByType(index, 'parking'));
        dispatch(UserActions.openSnackbar(types.SUCCESS));
      });
    } else {
      dispatch(StopPlaceActions.removeElementByType(index, 'parking'));
    }

    this.setState({
      confirmDeleteDialogOpen: false
    });
  }

  handleChangeCoordinates(position) {
    const { dispatch, index, handleLocateOnMap } = this.props;
    dispatch(StopPlaceActions.changeElementPosition(index, 'quay', position));
    handleLocateOnMap(position);
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

    if (parkingType === PARKING_TYPE.PARK_AND_RIDE) {
      const numberOfSpaces = Number(parking.numberOfSpaces);
      const numberOfSpacesForRegisteredDisabledUserType = Number(parking.numberOfSpacesForRegisteredDisabledUserType);

      if (!isNaN(numberOfSpaces) && !isNaN(numberOfSpacesForRegisteredDisabledUserType)) {
        totalCapacity = numberOfSpaces + numberOfSpacesForRegisteredDisabledUserType;
      } else if (!isNaN(numberOfSpaces)) {
        totalCapacity = numberOfSpaces;
      } else if (!isNaN(numberOfSpacesForRegisteredDisabledUserType)) {
        totalCapacity = numberOfSpacesForRegisteredDisabledUserType;
      }
    }

    return (
      <Item
        handleChangeCoordinates={this.handleChangeCoordinates}>
        <ItemHeader
          translations={translations}
          location={parking.location}
          expanded={expanded}
          handleLocateOnMap={() => handleLocateOnMap(parking.location, index, 'parking')}
          handleToggleCollapse={() => handleToggleCollapse(index, 'parking')}
          handleMissingCoordinatesClick={() => this.setState({ coordinatesDialogOpen: true })}>
            {formatMessage({ id: `parking_item_title_${parkingType}` })}
            {parking.hasExpired &&
              <ToolTippable
                toolTipText={formatMessage({ id: 'parking_expired' })}
                toolTipStyle={{ padding: '0 5' }}
              >
                <Warning
                  color="orange"
                  style={{ width: 20, height: 20, marginLeft: 5 }}
                />
              </ToolTippable>
            }
            <ToolTippable toolTipText={formatMessage({ id: 'totalCapacity' })} toolTipStyle={{ padding: '0 5' }}>
              <Code type="privateCode" value={`${totalCapacity}`} defaultValue={translations.notAsssigned} />
            </ToolTippable>
            <span
                style={{
                  fontSize: '0.8em',
                  marginLeft: 5,
                  fontWeight: 600,
                  color: '#464545',
                }}
            >
              {parking.id}
            </span>
        </ItemHeader>
        {expanded && (
          <div className="pr-item-expanded">
            <TextField
              hintText={this.props.translations.name}
              disabled={this.props.disabled || this.props.parking.hasExpired}
              floatingLabelText={this.props.translations.name}
              onChange={(e, v) => {
                this.handleSetName(v);
              }}
              value={this.props.parking.name}
              style={{ width: '95%', marginTop: -10 }}
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
                numberOfSpacesWithRechargePoint={parking.numberOfSpacesWithRechargePoint}
                numberOfSpacesForRegisteredDisabledUserType={parking.numberOfSpacesForRegisteredDisabledUserType}
                handleSetParkingLayout={this.handleSetParkingLayout.bind(this)}
                handleSetParkingPaymentProcess={this.handleSetParkingPaymentProcess.bind(this)}
                handleSetRechargingAvailable={this.handleSetRechargingAvailable.bind(this)}
                handleSetNumberOfSpaces={this.handleSetNumberOfSpaces.bind(this)}
                handleSetNumberOfSpacesWithRechargePoint={this.handleSetNumberOfSpacesWithRechargePoint.bind(this)}
                handleSetNumberOfSpacesForRegisteredDisabledUserType={this.handleSetNumberOfSpacesForRegisteredDisabledUserType.bind(this)} />
            ) : (
              <TextField
                hintText={translations.capacity}
                disabled={disabled || parking.hasExpired}
                floatingLabelText={translations.capacity}
                onChange={(e, v) => {
                  this.handleSetTotalCapacity(v);
                }}
                value={parking.totalCapacity}
                type="number"
                style={{ width: '95%', marginTop: -10 }} />
            )}

            <div style={{ width: '100%', textAlign: 'right' }}>
              <ToolTippable
                toolTipText={formatMessage({ id: 'delete_parking' })}
                tootTipTextStyle={{ position: 'relative' }}>
                <FlatButton
                  icon={<MdDeleteForver/>}
                  onClick={this.handleDeleteParking.bind(this)}
                  style={{ borderRadius: 25}}/>
              </ToolTippable>
            </div>
          </div>
        )}
        <ConfirmDialog
          open={this.state.confirmDeleteDialogOpen}
          handleClose={() => { this.setState({confirmDeleteDialogOpen: false});}}
          handleConfirm={this.handleConfirmParking.bind(this)}
          intl={intl}
          messagesById={{
            title: 'delete_parking',
            body: 'delete_parking_are_you_sure',
            confirm: 'delete_group_confirm',
            cancel: 'delete_group_cancel'
          }}
        />
      </Item>
    );
  }
}

export default injectIntl(connect(null)(withApollo(ParkingItem)));
