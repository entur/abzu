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
import TextField from 'material-ui/TextField';
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location';
import IconButton from 'material-ui/IconButton';
import { connect } from 'react-redux';
import { StopPlaceActions } from '../../actions/';
import Warning from 'material-ui/svg-icons/alert/warning';
import MdNotInterested from 'material-ui/svg-icons/av/not-interested';
import MdRestore from 'material-ui/svg-icons/action/restore';
import ToolTippable from './ToolTippable';
import { injectIntl } from 'react-intl';

class ParkingItem extends React.Component {
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

  handleExpireParking(index) {
    this.props.dispatch(StopPlaceActions.removeElementByType(index, 'parking'));
  }

  handleOpenParking(index) {
    this.props.dispatch(StopPlaceActions.openParkingElement(index));
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
        {!expanded
          ? null
          : <div className="pr-item-expanded">
              <TextField
                hintText={translations.name}
                disabled={disabled || parking.hasExpired}
                floatingLabelText={translations.name}
                onChange={(e, v) => {
                  this.handleSetName(v);
                }}
                value={parking.name}
                style={{ width: '95%', marginTop: -10 }}
              />
              <TextField
                hintText={translations.capacity}
                disabled={disabled || parking.hasExpired}
                floatingLabelText={translations.capacity}
                onChange={(e, v) => {
                  this.handleSetTotalCapacity(v);
                }}
                value={parking.totalCapacity}
                type="number"
                style={{ width: '95%', marginTop: -10 }}
              />
              <div style={{ width: '100%', textAlign: 'right' }}>
                <IconButton disabled={disabled}>
                  {parking.hasExpired
                    ? <ToolTippable
                        toolTipText={formatMessage({ id: 'restore_parking' })}
                      >
                        <MdRestore
                          onClick={() => this.handleOpenParking(index)}
                        />
                      </ToolTippable>
                    : <ToolTippable
                        toolTipText={formatMessage({ id: 'expire_parking' })}
                      >
                        <MdNotInterested
                          onClick={() => this.handleExpireParking(index)}
                        />
                      </ToolTippable>}
                </IconButton>
              </div>
            </div>}
      </div>
    );
  }
}

export default injectIntl(connect(null)(ParkingItem));
