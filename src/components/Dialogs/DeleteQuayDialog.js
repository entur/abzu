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
import MdCancel from "material-ui/svg-icons/navigation/cancel";
import MdDelete from "material-ui/svg-icons/action/delete-forever";
import MdWarning from "material-ui/svg-icons/alert/warning";
import Spinner from "../../static/icons/spinner";
import Checkbox from "material-ui/Checkbox";

class DeleteQuayDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changesUnderstood: false,
    };
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.open && !nextProps.open) {
      this.setState({
        changesUnderstood: false,
      });
    }
  }

  getUsageWarning() {
    const { fetchingOTPInfoLoading, warningInfo, intl } = this.props;
    const { formatMessage } = intl;
    const infoStyle = { fontSize: "1.1em", borderBottom: 10 };

    if (fetchingOTPInfoLoading) {
      return (
        <div style={{ ...infoStyle, display: "flex", alignItems: "center" }}>
          <Spinner />
          <div style={{ marginLeft: 5, padding: "10px 0" }}>
            {formatMessage({ id: "checking_quay_usage" })}
          </div>
        </div>
      );
    }

    if (warningInfo) {
      const { warning, authorities } = warningInfo;

      if (warning) {
        const panicStyle = {
          color: "#000",
          padding: 10,
          marginBottom: 10,
          border: "1px solid black",
          background: "rgb(252, 200, 197)",
        };
        return (
          <div style={panicStyle}>
            <div>{formatMessage({ id: "quay_usages_found" })}</div>
            {
              <div
                style={{
                  fontWeight: 600,
                  marginTop: 5,
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: "1.5",
                }}
              >
                <div>
                  {formatMessage({ id: "important_quay_usages_found" })}
                </div>
                <div style={{ fontStyle: "italic" }}>
                  {authorities && authorities.join(", ")}
                </div>
              </div>
            }
          </div>
        );
      }
    }
    return null;
  }

  render() {
    const {
      open,
      intl,
      handleClose,
      deletingQuay,
      handleConfirm,
      isLoading,
      importedId = [],
    } = this.props;
    const { changesUnderstood } = this.state;
    const { formatMessage } = intl;

    const translations = {
      confirm: formatMessage({ id: "confirm" }),
      cancel: formatMessage({ id: "cancel" }),
      title: formatMessage({ id: "delete_quay_title" }),
      info: formatMessage({ id: "delete_quay_info" }),
      warning: formatMessage({ id: "delete_quay_warning" }),
      are_you_sure: formatMessage({ id: "delete_quay_are_you_sure" }),
      importedId: formatMessage({ id: "local_reference" }),
      importedId_empty: formatMessage({ id: "local_reference_empty" }),
      important_notice: formatMessage({ id: "important_notice" }),
    };

    const actions = [
      <FlatButton
        label={translations.cancel}
        onClick={handleClose}
        icon={<MdCancel />}
      />,
      <FlatButton
        label={translations.confirm}
        onClick={handleConfirm}
        primary={true}
        disabled={isLoading || !changesUnderstood}
        keyboardFocused={true}
        icon={isLoading ? <Spinner /> : <MdDelete />}
      />,
    ];

    return (
      <Dialog
        title={translations.title}
        actions={actions}
        modal={true}
        open={open}
        onRequestClose={() => {
          handleClose();
        }}
        contentStyle={{ width: "40%", minWidth: "40%", margin: "auto" }}
      >
        <div>
          <div style={{ marginBottom: 20, color: "#000" }}>
            <span style={{ fontWeight: 600 }}>
              {deletingQuay ? deletingQuay.quayId : null}
            </span>
          </div>
          <div style={{ fontSize: "1.3em", color: "#000", marginBottom: 5 }}>
            {translations.important_notice}
          </div>
          {this.getUsageWarning()}
          <div
            style={{
              marginLeft: 0,
              color: "#000",
              background: "#fcc8c5",
              padding: 10,
              border: "1px solid black",
            }}
          >
            {translations.info}
          </div>
          {importedId.length ? (
            <div
              style={{
                padding: 10,
                color: "#000",
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              <div>{translations.importedId}</div>
              <ol>
                {importedId.map((entry, index) => (
                  <li
                    key={"importedId-" + index}
                    style={{ lineHeight: "1.4em" }}
                  >
                    {entry}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p style={{ fontStyle: "italic" }}>
              {translations.importedId_empty}
            </p>
          )}
          <Checkbox
            style={{ marginTop: 10 }}
            checked={changesUnderstood}
            onCheck={(e, v) => {
              this.setState({ changesUnderstood: v });
            }}
            label={translations.are_you_sure}
          />
          <div style={{ marginTop: 10, display: "flex", alignItems: "center" }}>
            <MdWarning color="orange" />
            <span style={{ fontWeight: 600, marginLeft: 5 }}>
              {translations.warning}
            </span>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default DeleteQuayDialog;
