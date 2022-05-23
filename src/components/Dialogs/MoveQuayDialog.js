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
import MdMerge from "material-ui/svg-icons/editor/merge-type";
import Code from "../EditStopPage/Code";
import AcceptChanges from "../EditStopPage/AcceptChanges";
import Spinner from "../../static/icons/spinner";

class MoveQuayDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changesUnderstood: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && !nextProps.open) {
      this.setState({
        changesUnderstood: false,
      });
    }
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const {
      open,
      intl,
      handleClose,
      handleConfirm,
      stopPlaceId,
      quay,
      hasStopBeenModified,
      isLoading,
    } = this.props;
    const { formatMessage } = intl;
    const { changesUnderstood } = this.state;
    let enableConfirm = !hasStopBeenModified || changesUnderstood;

    if (!quay) return null;

    const translations = {
      confirm: formatMessage({ id: "confirm" }),
      cancel: formatMessage({ id: "cancel" }),
      title: formatMessage({ id: "move_quay_title" }),
      info: formatMessage({ id: "move_quay_info" }),
    };

    const fromVersionComment = `Flyttet ${quay.id} til ${stopPlaceId}`;
    const toVersionComment = `Flyttet ${quay.id} til ${stopPlaceId}`;

    const actions = [
      <FlatButton
        label={translations.cancel}
        onClick={handleClose}
        icon={<MdCancel />}
      />,
      <FlatButton
        label={translations.confirm}
        disabled={!enableConfirm || isLoading}
        onClick={() => {
          handleConfirm(fromVersionComment, toVersionComment);
        }}
        primary={true}
        keyboardFocused={true}
        icon={isLoading ? <Spinner /> : <MdMerge />}
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
          <div style={{ marginBottom: 10, color: "#000" }}>
            <span
              style={{ fontWeight: 600 }}
            >{`${quay.id} => ${stopPlaceId}`}</span>
            <div
              style={{
                display: "flex",
                padding: 5,
                textAlign: "center",
                width: "100%",
              }}
            >
              <Code type="publicCode" value={quay.publicCode} />
              <Code type="privateCode" value={quay.privateCode} />
            </div>
          </div>
          <span>{translations.info}</span>
          {hasStopBeenModified && (
            <AcceptChanges
              checked={changesUnderstood}
              onChange={(e, v) => this.setState({ changesUnderstood: v })}
            />
          )}
        </div>
      </Dialog>
    );
  }
}

export default MoveQuayDialog;
