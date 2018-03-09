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
import { StopPlaceActions } from '../../actions/';
import { connect } from 'react-redux';

class PathJunctionItem extends React.Component {
  static propTypes = {
    translations: PropTypes.object.isRequired,
    pathJunction: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    handleRemovePathJunction: PropTypes.func.isRequired,
    handleLocateOnMap: PropTypes.func.isRequired,
    expanded: PropTypes.bool.isRequired,
  };

  handleNameChange = event => {
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changePublicCodeName(
        index,
        event.target.value,
        'pathJunction',
      ),
    );
  };

  handleDescriptionChange = event => {
    const { dispatch, index } = this.props;
    dispatch(
      StopPlaceActions.changeElementDescription(
        index,
        event.target.value,
        'pathJunction',
      ),
    );
  };

  render() {
    const {
      pathJunction,
      translations,
      expanded,
      handleToggleCollapse,
      index,
      disabled,
    } = this.props;

    const description = pathJunction.description || '';

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
              onClick={() =>
                this.props.handleLocateOnMap(pathJunction.location, index, 'pathJunction')}
            />
            <div
              style={{ display: 'inline-block' }}
              onClick={() => handleToggleCollapse(index, 'pathJunction')}
            >
              {pathJunction.name.length ? pathJunction.name : translations.notAssigned}
            </div>
            <div
              style={{ display: 'inline-block' }}
              onClick={() => handleToggleCollapse(index, 'pathJunction')}
            />
            {!expanded
              ? <NavigationExpandMore
                  onClick={() => handleToggleCollapse(index, 'pathJunction')}
                  style={{ float: 'right' }}
                />
              : <NavigationExpandLess
                  onClick={() => handleToggleCollapse(index, 'pathJunction')}
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
                value={pathJunction.name}
                style={{ width: '95%', marginTop: -10 }}
                onChange={e =>
                  typeof e.target.value === 'string' &&
                  this.handleNameChange(e)}
              />
              <TextField
                disabled={disabled}
                hintText={translations.description}
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
                  onClick={this.props.handleRemovePathJunction}
                >
                  delete
                </IconButton>
              </div>
            </div>}
      </div>
    );
  }
}

export default connect(null)(PathJunctionItem);
