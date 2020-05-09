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


import React  from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class WalkingDistanceDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
    };
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    estimate: PropTypes.number,
    handleConfirm: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  };

  handleInputChange(event, newValue) {
    this.setState({
      estimate: newValue,
    });
  }

  handleClose() {
    this.setState({
      estimate: null,
      errorText: '',
    });
    this.props.handleClose();
  }

  handleConfirm() {
    const { estimate } = this.state;
    const { index } = this.props;

    if (typeof estimate === 'undefined') return;

    if (!isNaN(estimate)) {
      this.props.handleConfirm(index, Number(estimate));

      this.setState({
        estimate: 0,
        errorText: '',
      });
    } else {
      this.setState({
        errorText: this.props.intl.formatMessage({
          id: 'change_compass_bearing_invalid',
        }),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      estimate: nextProps.estimate,
      errorText: '',
    });
  }

  render() {
    const { open, intl } = this.props;
    const { formatMessage } = intl;
    const { estimate } = this.state;

    const translation = {
      title: formatMessage({ id: 'change_walking_distance_estimate' }),
      body: formatMessage({ id: 'change_walking_distance_help_text' }),
      confirm: formatMessage({ id: 'change_walking_distance_confirm' }),
      cancel: formatMessage({ id: 'change_walking_distance_cancel' }),
    };

    const buttonWrapperStyle = {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 20,
    };

    const actions = [
      <TextField
        hintText={formatMessage({ id: 'seconds' })}
        floatingLabelText={formatMessage({ id: 'seconds' })}
        floatingLabelStyle={{ textTransform: 'capitalize' }}
        style={{ display: 'block', margin: 'auto', width: '90%' }}
        value={estimate}
        onChange={this.handleInputChange.bind(this)}
        errorText={this.state.errorText}
      />,
      <div style={buttonWrapperStyle}>
        <FlatButton
          label={translation.cancel}
          primary={false}
          keyboardFocused={true}
          onClick={() => this.handleClose()}
          style={{ marginRight: 5 }}
        />
        <FlatButton
          label={translation.confirm}
          primary={true}
          keyboardFocused={true}
          onClick={() => this.handleConfirm()}
        />
      </div>,
    ];

    return (
      <div>
        <Dialog
          title={translation.title}
          actions={actions}
          modal={false}
          open={open}
          contentStyle={{ width: '45vw' }}
        >
          {translation.body}
        </Dialog>
      </div>
    );
  }
}

export default WalkingDistanceDialog;
