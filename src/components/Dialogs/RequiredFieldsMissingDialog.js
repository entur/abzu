import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Info } from "@mui/icons-material";

class RequiredFieldsMissingDialog extends Component {
  render() {
    const { open, handleClose, requiredMissing, formatMessage, isNewStop } =
      this.props;
    const { name, type } = requiredMissing;

    const translations = {
      labelOK: formatMessage({ id: "ok" }),
      title: formatMessage({ id: "required_fields_missing_title" }),
      info: formatMessage({ id: "required_fields_missing_info" }),
      name: formatMessage({ id: "name" }),
      stopPlaceType: formatMessage({ id: "stopPlaceType" }),
      setMissingFieldsNewStop: formatMessage({
        id: "required_fields_missing_action_new",
      }),
      setMissingFields: formatMessage({ id: "required_fields_missing_action" }),
    };

    return (
      <Dialog open={open}>
        <DialogTitle>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Info style={{ height: "1.4em", width: "1.4em" }} />
            <div style={{ marginLeft: 5 }}>{translations.title}</div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div style={{ fontWeight: 600, color: "#000" }}>
            {translations.info}
          </div>
          <ul style={{ color: "#000" }}>
            {name && <li>{translations.name}</li>}
            {type && <li>{translations.stopPlaceType}</li>}
          </ul>
          {isNewStop ? (
            <p>{translations.setMissingFieldsNewStop}</p>
          ) : (
            <p>{translations.setMissingFields}</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => handleClose()}>
            {translations.labelOK}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

RequiredFieldsMissingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  requiredMissing: PropTypes.object.isRequired,
  formatMessage: PropTypes.func.isRequired,
};

export default RequiredFieldsMissingDialog;
