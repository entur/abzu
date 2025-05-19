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

import { Cancel, Merge } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import Spinner from "../../static/icons/spinner";
import AcceptChanges from "../EditStopPage/AcceptChanges";
import MergeQuaysDetails from "../EditStopPage/MergeQuaysDetails";

class MergeQuaysDialog extends React.Component {
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && !nextProps.open) {
      this.setState({
        changesUnderstood: false,
      });
    }
  }

  getUsageWarning() {
    const { OTPFetchIsLoading, mergeQuayWarning, intl } = this.props;
    const { formatMessage } = intl;
    const infoStyle = { fontSize: "1.1em", borderBottom: 10 };

    if (OTPFetchIsLoading) {
      return (
        <div style={{ ...infoStyle, display: "flex", alignItems: "center" }}>
          <Spinner />
          <div style={{ marginLeft: 5 }}>
            {formatMessage({ id: "checking_quay_usage" })}
          </div>
        </div>
      );
    }

    if (mergeQuayWarning) {
      const { warning, authorities } = mergeQuayWarning;

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
      mergingQuays,
      handleConfirm,
      hasStopBeenModified,
      OTPFetchIsLoading,
      isLoading,
    } = this.props;

    const { formatMessage } = intl;
    const { changesUnderstood } = this.state;

    const translations = {
      confirm: formatMessage({ id: "confirm" }),
      cancel: formatMessage({ id: "cancel" }),
      title: formatMessage({ id: "merge_quays_title" }),
      info: formatMessage({ id: "merge_quays_info" }),
      warning: formatMessage({ id: "merge_quays_warning" }),
    };

    const enableConfirm = !hasStopBeenModified || changesUnderstood;

    const fromQuay = mergingQuays.fromQuay ? mergingQuays.fromQuay.id : "";
    const toQuay = mergingQuays.toQuay ? mergingQuays.toQuay.id : "";

    const versionComment = `Flettet quay ${fromQuay} til ${toQuay}`;

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
            {this.getUsageWarning()}
            <MergeQuaysDetails merginQuays={mergingQuays} />
            <div style={{ marginLeft: 0, fontSize: 14 }}>
              {translations.info}
            </div>
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
            onClick={() => {
              handleConfirm(versionComment);
            }}
            disabled={!enableConfirm || isLoading || OTPFetchIsLoading}
            startIcon={isLoading ? <Spinner /> : <Merge />}
          >
            {translations.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default MergeQuaysDialog;
