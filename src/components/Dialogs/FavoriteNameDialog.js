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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { UserActions } from "../../actions/";

class FavoriteNameDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleText: "",
      errorText: "",
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
        errorText: formatMessage({ id: "field_is_required" }),
      });
    } else {
      this.props.dispatch(UserActions.saveSearchAsFavorite(titleText));
    }
  };

  handleChange = (event) => {
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
      cancel: formatMessage({ id: "cancel" }),
      use: formatMessage({ id: "use" }),
      title_for_favorite: formatMessage({ id: "title_for_favorite" }),
    };

    return (
      <div>
        <Dialog open={isOpen} onClose={this.handleClose}>
          <DialogTitle>{labelTexts.title_for_favorite}</DialogTitle>
          <DialogContent>
            <TextField
              name="favoriteTittel"
              fullWidth={true}
              errorText={errorText}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              onClick={this.handleClose.bind(this)}
              color="secondary"
            >
              {labelTexts.cancel}
            </Button>
            <Button variant="text" onClick={this.handleSubmit.bind(this)}>
              {labelTexts.use}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isOpen: state.user.favoriteNameDialogIsOpen,
});

export default injectIntl(connect(mapStateToProps)(FavoriteNameDialog));
