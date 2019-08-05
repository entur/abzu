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
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location';
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

  handleSetName(value) {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingName(index, value));
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

  render() {
    const {
      parking,
      translations,
      expanded,
      handleToggleCollapse,
      index,
      disabled,
      parkingType,
      intl
    } = this.props;

    const { formatMessage } = intl;

    const locationStyle = {
      marginRight: 5,
      verticalAlign: 'text-top',
      height: 16,
      width: 16
    };

    return (
      <div>
        <div className="tabItem">
          <div
            style={{ float: 'left', width: '95%', marginTop: 20, padding: 5 }}
          >
            <MapsMyLocation
              style={locationStyle}
              onClick={() =>
                this.props.handleLocateOnMap(
                  parking.location,
                  index,
                  'parking'
                )}
            />
            <div
              style={{ display: 'inline-block' }}
              onClick={() => handleToggleCollapse(index, 'parking')}
            >
              <div style={{ display: 'flex', lineHeight: '28px' }}>
                {translations[parkingType]}
                {parking.hasExpired &&
                  <ToolTippable
                    toolTipText={formatMessage({ id: 'parking_expired' })}
                    toolTipStyle={{ padding: '0 5' }}
                  >
                    <Warning
                      color="orange"
                      style={{ width: 20, height: 20, marginLeft: 5 }}
                    />
                  </ToolTippable>}
                <span style={{ width: 20, height: 20, marginLeft: 5 }}>
                  <ToolTippable toolTipText={formatMessage({ id: 'totalCapacity' })}
                                toolTipStyle={{ padding: '0 5' }}>
                  {parking.totalCapacity}
                  </ToolTippable>
                </span>
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

              </div>
            </div>
            <div
              style={{ display: 'inline-block' }}
              onClick={() => handleToggleCollapse(index, 'parking')}
            />
            {!expanded
              ? <NavigationExpandMore
                  onClick={() => handleToggleCollapse(index, 'parking')}
                  style={{ float: 'right' }}
                />
              : <NavigationExpandLess
                  onClick={() => handleToggleCollapse(index, 'parking')}
                  style={{ float: 'right' }}
                />}
          </div>
        </div>
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

            {parkingType === 'parkAndRide' && (
              <ParkingItemPayAndRideExpandedFields
                translations={translations}
                disabled={disabled}
                hasExpired={parking.hasExpired}
                parkingPaymentProcess={parking.parkingPaymentProcess}
                rechargingAvailable={parking.rechargingAvailable}
                numberOfSpaces={parking.numberOfSpaces}
                numberOfSpacesWithRechargePoint={parking.numberOfSpacesWithRechargePoint}
                numberOfSpacesForRegisteredDisabledUserType={parking.numberOfSpacesForRegisteredDisabledUserType}
                handleSetParkingPaymentProcess={this.handleSetParkingPaymentProcess.bind(this)}
                handleSetRechargingAvailable={this.handleSetRechargingAvailable.bind(this)}
                handleSetNumberOfSpaces={this.handleSetNumberOfSpaces.bind(this)}
                handleSetNumberOfSpacesWithRechargePoint={this.handleSetNumberOfSpacesWithRechargePoint.bind(this)}
                handleSetNumberOfSpacesForRegisteredDisabledUserType={this.handleSetNumberOfSpacesForRegisteredDisabledUserType.bind(this)} />
            )}

            <TextField
              hintText={translations.capacity}
              disabled
              floatingLabelText={translations.capacity}
              value={Number(parking.numberOfSpaces) + Number(parking.numberOfSpacesForRegisteredDisabledUserType)}
              type="number"
              style={{ width: '95%', marginTop: -10 }} />
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
      </div>
    );
  }
}

export default injectIntl(connect(null)(withApollo(ParkingItem)));
