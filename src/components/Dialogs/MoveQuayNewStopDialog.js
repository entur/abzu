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
import AcceptChanges from "../EditStopPage/AcceptChanges";
import ScrollableQuayList from "./ScrollableQuayList";
import Spinner from "../../static/icons/spinner";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Cancel, Merge } from "@mui/icons-material";

class MoveQuayNewStopDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changesUnderstood: false,
      quayIds: [],
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && !nextProps.open) {
      this.setState({
        changesUnderstood: false,
        quayIds: [],
      });
    }
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState({
        changesUnderstood: false,
        quayIds: nextProps.quay ? [nextProps.quay.id] : [],
      });
    }
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    quays: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  handleUpdate(quayIds) {
    this.setState({
      quayIds: quayIds,
    });
  }

  render() {
    const {
      open,
      intl,
      handleClose,
      handleConfirm,
      quay,
      quays,
      hasStopBeenModified,
      isLoading,
    } = this.props;
    const { formatMessage } = intl;
    const { changesUnderstood, quayIds } = this.state;
    let enableConfirm = !hasStopBeenModified || changesUnderstood;

    if (!quay) return null;

    const translations = {
      confirm: formatMessage({ id: "confirm" }),
      cancel: formatMessage({ id: "cancel" }),
      title: formatMessage({ id: "move_quay_new_stop_title" }),
      info: formatMessage({ id: "move_quay_new_stop_info" }),
      result: formatMessage({
        id:
          quayIds.length > 1
            ? "move_quay_new_stop_consequence_pl"
            : "move_quay_new_stop_consequence",
      }),
    };

    const fromStopPlaceId = quay.stopPlaceId;
    const fromVersionComment = `Flyttet ${quayIds.join(
      ", "
    )} til nytt stoppested`;
    const toVersionComment = `Flyttet ${quayIds.join(
      ", "
    )} fra ${fromStopPlaceId}`;

    return (
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
      >
        <DialogTitle>{translations.title}</DialogTitle>
        <DialogContent>
          <div>
            <div style={{ marginBottom: 10, fontWeight: 600, color: "#000" }}>
              {quayIds.length} {translations.result}
            </div>
            <ScrollableQuayList
              style={{ marginBottom: 10, color: "#000" }}
              quays={quays}
              handleUpdate={this.handleUpdate.bind(this)}
              defaultQuayId={quay.id}
              formatMessage={formatMessage}
            />
            <div style={{ fontSize: "0.9em" }}>{translations.info}</div>
            {hasStopBeenModified && (
              <AcceptChanges
                checked={changesUnderstood}
                onChange={(e, v) => this.setState({ changesUnderstood: v })}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={handleClose}
            startIcon={<Cancel />}
            color="secondary"
          >
            {translations.cancel}
          </Button>
          <Button
            variant="text"
            disabled={!enableConfirm || isLoading || !quayIds.length}
            onClick={() => {
              handleConfirm(quayIds, fromVersionComment, toVersionComment);
            }}
            startIcon={isLoading ? <Spinner /> : <Merge />}
          >
            {translations.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default MoveQuayNewStopDialog;
