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

import React from "react";
import PropTypes from "prop-types";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { extractCoordinates } from "../../utils/";

class CoordinatesDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: "",
    };
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    coordinates: PropTypes.string,
    handleConfirm: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  handleInputChange(event, newValue) {
    this.setState({
      coordinates: newValue,
    });
  }

  handleClose() {
    this.setState({
      coordinates: null,
      errorText: "",
    });
    this.props.handleClose();
  }

  handleConfirm() {
    const coordinatesString = this.state
      ? this.state.coordinates
      : this.props.coordinates;

    if (typeof coordinatesString === "undefined") return;

    const position = extractCoordinates(coordinatesString);

    if (position) {
      this.props.handleConfirm(position);

      this.setState({
        coordinates: null,
        errorText: "",
      });
    } else {
      this.setState({
        errorText: this.props.intl.formatMessage({
          id: "change_coordinates_invalid",
        }),
      });
    }
  }

  render() {
    const { open, intl, titleId } = this.props;
    const { formatMessage } = intl;
    const coordinates = this.state.coordinates || this.props.coordinates;

    const confirmDialogTranslation = {
      title: formatMessage({ id: titleId || "change_coordinates" }),
      body: formatMessage({ id: "change_coordinates_help_text" }),
      confirm: formatMessage({ id: "change_coordinates_confirm" }),
      cancel: formatMessage({ id: "change_coordinates_cancel" }),
    };

    const buttonWrapperStyle = {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 20,
    };

    const actions = [
      <TextField
        hintText="lat,lng"
        floatingLabelText={formatMessage({ id: "coordinates" })}
        style={{ display: "block", margin: "auto", width: "90%" }}
        value={coordinates}
        onChange={this.handleInputChange.bind(this)}
        errorText={this.state.errorText}
      />,
      <div style={buttonWrapperStyle}>
        <FlatButton
          label={confirmDialogTranslation.cancel}
          primary={false}
          keyboardFocused={true}
          onClick={() => this.handleClose()}
          style={{ marginRight: 5 }}
        />
        <FlatButton
          label={confirmDialogTranslation.confirm}
          primary={true}
          keyboardFocused={true}
          onClick={() => this.handleConfirm()}
        />
      </div>,
    ];

    return (
      <div>
        <Dialog
          title={confirmDialogTranslation.title}
          actions={actions}
          modal={false}
          open={open}
          contentStyle={{ width: "45vw" }}
        >
          {confirmDialogTranslation.body}
        </Dialog>
      </div>
    );
  }
}

export default CoordinatesDialog;
