import React, { Component } from "react";
import PropTypes from "prop-types";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import MdInfo from "material-ui/svg-icons/action/info-outline";

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

    const actions = [
      <FlatButton onClick={() => handleClose()} label={translations.labelOK} />,
    ];

    return (
      <Dialog
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <MdInfo style={{ height: "1.4em", width: "1.4em" }} />
            <div style={{ marginLeft: 5 }}>{translations.title}</div>
          </div>
        }
        open={open}
        actions={actions}
      >
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
