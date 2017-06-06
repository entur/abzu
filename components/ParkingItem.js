import React, { Component, PropTypes } from 'react';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import TextField from 'material-ui/TextField';
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location';
import IconButton from 'material-ui/IconButton';
import { connect } from 'react-redux';
import { StopPlaceActions } from '../actions/';

class ParkingItem extends React.Component {
  static propTypes = {
    translations: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    expanded: PropTypes.bool.isRequired,
    parking: PropTypes.object.isRequired,
  };

  handleSetTotalCapacity(value) {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingTotalCapacity(index, value));
  }

  handleSetName(value) {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.changeParkingName(index, value));
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
    } = this.props;

    const locationStyle = {
      marginRight: 5,
      verticalAlign: 'text-top',
      height: 16,
      width: 16,
    };

    return (
      <div>
        <div className="tabItem">
          <div
            style={{ float: 'left', width: '95%', marginTop: 20, padding: 5 }}
          >
            <MapsMyLocation
              style={locationStyle}
              onClick={() => this.props.handleLocateOnMap(parking.location)}
            />
            <div
              style={{ display: 'inline-block' }}
              onClick={() => handleToggleCollapse(index, 'parking')}
            >
              {translations[parkingType]}
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
          : <div>
              <TextField
                hintText={translations.name}
                disabled={disabled}
                floatingLabelText={translations.name}
                onChange={(e, v) => {
                  this.handleSetName(v);
                }}
                value={parking.name}
                style={{ width: '95%', marginTop: -10 }}
              />
              <TextField
                hintText={translations.capacity}
                disabled={disabled}
                floatingLabelText={translations.capacity}
                onChange={(e, v) => {
                  this.handleSetTotalCapacity(v);
                }}
                value={parking.totalCapacity}
                type="number"
                style={{ width: '95%', marginTop: -10 }}
              />
              <div style={{ width: '100%', textAlign: 'right' }}>
                <IconButton
                  disabled={disabled}
                  iconClassName="material-icons"
                  onClick={this.props.handleRemoveParking}
                >
                  delete
                </IconButton>
              </div>
            </div>}
      </div>
    );
  }
}

export default connect(null)(ParkingItem);
