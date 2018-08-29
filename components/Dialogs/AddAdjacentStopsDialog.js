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
import RadioButton from 'material-ui/RadioButton';
import Dialog from 'material-ui/Dialog';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';


class AddAdjacentStopDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedAdjacentStopPlace: 'NONE'
    };
  }

  handleChange = event => {
    this.setState({ selectedAdjacentStopPlace: event.target.value });
  };

  render() {
    const {
      open,
      intl,
      handleClose,
      handleConfirm,
      stopPlaceChildren,
      parentStopPlace,
      currentStopPlaceId
    } = this.props;

    const radioButtons = [];

    // const selectedStop = stopPlaceChildren.find(child => child.id === currentStopPlaceId);

    stopPlaceChildren.forEach(function(childStop) {
      if(childStop.id !== currentStopPlaceId) {
      radioButtons.push(
        <RadioButton
          key={childStop.id}
          label={childStop.id}
          checked={this.state.selectedAdjacentStopPlace === childStop.id}
          value={childStop.id}
          onCheck={this.handleChange.bind(this)}
          />)
      }
    }, this);

    radioButtons.push(
      <RadioButton
        key="NONE"
        label="None"
        checked={this.state.selectedAdjacentStopPlace === 'NONE'}
        value='NONE'
        onCheck={this.handleChange.bind(this)}
        />)

    const { formatMessage } = intl;

    const actions = [
      <FlatButton
        label={formatMessage({ id: 'cancel' })}
        primary={true}
        onTouchTap={handleClose}
      />,
      <FlatButton
        label={formatMessage({ id: 'confirm' })}
        disabled={this.state.selectedAdjacentStopPlace === 'NONE'}
        primary={true}
        onClick={() => handleConfirm(currentStopPlaceId, this.state.selectedAdjacentStopPlace)}
      />];

    return (
      <Dialog
        title={formatMessage({ id: 'connect_to_adjacent_stop_title' })}
        actions={actions}
        modal={true}
        open={open}
        onRequestClose={() => {
          handleClose();
        }}
        contentStyle={{ width: '40%', minWidth: '40%', margin: 'auto' }}
      >
        <div>Connect adjacent child stop {currentStopPlaceId} of {parentStopPlace.name} with:</div>
        {radioButtons}
      </Dialog>
    );
  }
}

AddAdjacentStopDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

const mapStateToProps = ({ stopPlace, user, roles }) => ({
  stopPlaceChildren: stopPlace.current.children,
  parentStopPlace: stopPlace.current,
  currentStopPlaceId: user.adjacentStopDialogStopPlace
});

export default connect(mapStateToProps)(injectIntl(AddAdjacentStopDialog));
