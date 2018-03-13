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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import * as types from '../actions/Types';
import MdCheck from 'material-ui/svg-icons/navigation/check';
import MdError from 'material-ui/svg-icons/alert/error';
import { UserActions } from '../actions/';
import FlatButton from 'material-ui/FlatButton';
import MdInfo from 'material-ui/svg-icons/action/info-outline';

class SnackbarWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleRequestClose() {
    this.props.dispatch(UserActions.dismissSnackbar());
  }

  getAlertIcon(status) {
    if (status === types.SUCCESS) {
      return (
        <MdCheck style={{ fill: '#088f17', color: '#fff', marginRight: 10 }} />
      );
    } else if (status == types.ERROR) {
      return (
        <MdError style={{ fill: '#cc0000', color: '#fff', marginRight: 10 }} />
      );
    } else {
      return null;
    }
  }

  render() {
    const { snackbarOptions, formatMessage } = this.props;
    const { isOpen, status, errorMsg } = snackbarOptions;
    const { expanded } = this.state;
    const autoHideDuration = status === types.SUCCESS ? 3000 : 0;
    const isError = (status === types.ERROR);
    const message = formatMessage({ id: isError ? 'snackbar_message_failed' : 'snackbar_message_saved'});
    const showExpanded = (expanded && isError);
    const notAssigned = formatMessage({ id: 'not_assigned'});

    return (
      <Snackbar
        open={isOpen}
        style={{ height: showExpanded ? 150 : 'initial', background: '#000' }}
        message={
          <div>
            {showExpanded &&
              <div
                style={{
                  color: '#fff',
                  lineHeight: 1.5,
                  padding: 5,
                  border: '1px dotted #fff',
                  marginTop: 8,
                  minHeight: 85
                }}
              >
                {errorMsg || notAssigned}
              </div>}
            <div
              style={{
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isError ? 'space-between' : 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {this.getAlertIcon(status)}
                {message}
              </div>
              {(isError) &&
                <FlatButton
                  icon={
                    <MdInfo
                      style={{ fill: '#fff' }}
                      onClick={() => {
                        this.setState({ expanded: !expanded });
                      }}
                    />
                  }
                />}
            </div>
          </div>
        }
        bodyStyle={{ background: '#000', opacity: '0.8' }}
        autoHideDuration={autoHideDuration}
        onRequestClose={this.handleRequestClose.bind(this)}
      />
    );
  }
}

const mapStateToProps = ({ snackbar }) => ({
  snackbarOptions: snackbar.snackbarOptions
});

export default connect(mapStateToProps)(SnackbarWrapper);
