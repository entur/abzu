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
import Dialog from 'material-ui/Dialog';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';


class AddAdjacentStopDialog extends React.Component {

  render() {
    const {
      open,
      intl,
      handleClose,
    } = this.props;

    const { formatMessage } = intl;

    const actions = [
      <FlatButton
        label={formatMessage({ id: 'cancel' })}
        primary={true}
        onTouchTap={handleClose}
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
        <div>Connect adjacent sites</div>
      </Dialog>
    );
  }
}



AddAdjacentStopDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

const mapStateToProps = ({ stopPlace, roles }) => ({
  stopPlaceChildren: stopPlace.current.children,
});

export default connect(mapStateToProps)(injectIntl(AddAdjacentStopDialog));
