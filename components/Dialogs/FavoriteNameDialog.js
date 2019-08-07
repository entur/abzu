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
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { UserActions } from '../../actions/';

class FavoriteNameDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleText: '',
      errorText: '',
    };
  }

  handleClose = () => {
    this.props.dispatch(UserActions.closeFavoriteNameDialog());
  };

  handleSubmit = () => {
    const { titleText } = this.state;

    if (!titleText.length) {
      const { formatMessage } = this.props.intl;

      this.setState({
        ...this.state,
        errorText: formatMessage({ id: 'field_is_required' }),
      });
    } else {
      this.props.dispatch(UserActions.saveSearchAsFavorite(titleText));
    }
  };

  handleChange = event => {
    this.setState({
      ...this.state,
      titleText: event.target.value,
    });
  };

  render() {
    const { formatMessage } = this.props.intl;
    const { isOpen } = this.props;
    const { errorText } = this.state;

    const labelTexts = {
      cancel: formatMessage({ id: 'cancel' }),
      use: formatMessage({ id: 'use' }),
      title_for_favorite: formatMessage({ id: 'title_for_favorite' }),
    };

    const actions = [
      <FlatButton
        label={labelTexts.cancel}
        primary={true}
        onClick={this.handleClose.bind(this)}
      />,
      <FlatButton
        label={labelTexts.use}
        primary={true}
        keyboardFocused={true}
        onClick={this.handleSubmit.bind(this)}
      />,
    ];

    return (
      <div>
        <Dialog
          title={labelTexts.title_for_favorite}
          actions={actions}
          modal={false}
          open={isOpen}
          onRequestClose={this.handleClose}
        >
          <TextField
            name="favoriteTittel"
            fullWidth={true}
            errorText={errorText}
            onChange={this.handleChange}
          />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.user.favoriteNameDialogIsOpen,
});

export default injectIntl(connect(mapStateToProps)(FavoriteNameDialog));
