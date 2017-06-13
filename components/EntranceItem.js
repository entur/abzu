import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import TextField from 'material-ui/TextField';
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location';
import IconButton from 'material-ui/IconButton';
import { StopPlaceActions } from '../actions/';
import { connect } from 'react-redux';

class EntranceItem extends React.Component {
  static propTypes = {
    translations: PropTypes.object.isRequired,
    entrance: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    handleRemoveEntrance: PropTypes.func.isRequired,
    handleLocateOnMap: PropTypes.func.isRequired,
    expanded: PropTypes.bool.isRequired,
  };

  handleNameChange = event => {
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changePublicCodeName(
        index,
        event.target.value,
        'entrance',
      ),
    );
  };

  handleDescriptionChange = event => {
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changeElementDescription(
        index,
        event.target.value,
        'entrance',
      ),
    );
  };

  render() {
    const {
      entrance,
      translations,
      expanded,
      handleToggleCollapse,
      index,
      disabled,
    } = this.props;

    const description = entrance.description || '';

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
              onClick={() => this.props.handleLocateOnMap(entrance.location)}
            />
            <div
              style={{ display: 'inline-block' }}
              onClick={() => handleToggleCollapse(index, 'entrance')}
            >
              {entrance.name.length ? entrance.name : 'N/A'}
            </div>
            <div
              style={{ display: 'inline-block' }}
              onClick={() => handleToggleCollapse(index, 'entrance')}
            />
            {!expanded
              ? <NavigationExpandMore
                  onClick={() => handleToggleCollapse(index, 'entrance')}
                  style={{ float: 'right' }}
                />
              : <NavigationExpandLess
                  onClick={() => handleToggleCollapse(index, 'entrance')}
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
                value={entrance.name}
                style={{ width: '95%', marginTop: -10 }}
                onChange={e =>
                  typeof e.target.value === 'string' &&
                  this.handleNameChange(e)}
              />
              <TextField
                hintText={translations.description}
                disabled={disabled}
                floatingLabelText={translations.description}
                value={description}
                style={{ width: '95%', marginTop: -10 }}
                onChange={e =>
                  typeof e.target.value === 'string' &&
                  this.handleDescriptionChange(e)}
              />
              <div style={{ width: '100%', textAlign: 'right' }}>
                <IconButton
                  iconClassName="material-icons"
                  disabled={disabled}
                  onClick={this.props.handleRemoveEntrance}
                >
                  delete
                </IconButton>
              </div>
            </div>}
      </div>
    );
  }
}

export default connect(null)(EntranceItem);
