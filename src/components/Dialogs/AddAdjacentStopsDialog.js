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
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import AddStopPlaceSuggestionListItem from "./AddStopPlaceSuggestionListItem";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

class AddAdjacentStopDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAdjacentStopPlace: "NONE",
    };
  }

  handleChange = (event, checked) => {
    if (checked) {
      this.setState({ selectedAdjacentStopPlace: event });
    } else {
      this.setState({ selectedAdjacentStopPlace: "NONE" });
    }
  };

  isCurrentChildStop(childStop) {
    return childStop.id === this.props.currentStopPlaceId;
  }

  isConnected(childStop) {
    const currentChild = this.props.stopPlaceChildren.find(
      (child) => child.id === this.props.currentStopPlaceId
    );

    // Avoid displaying already existing adjacent site as an option:
    if (currentChild && Array.isArray(currentChild.adjacentSites)) {
      return currentChild.adjacentSites.some(
        (adjacentRef) => adjacentRef.ref === childStop.id
      );
    }
    return false;
  }

  render() {
    const {
      open,
      intl,
      handleClose,
      handleConfirm,
      stopPlaceChildren,
      currentStopPlaceId,
    } = this.props;

    const { formatMessage } = intl;

    return (
      <Dialog
        open={open}
        onRequestClose={() => {
          handleClose();
        }}
        contentStyle={{ width: "40%", minWidth: "40%", margin: "auto" }}
      >
        <DialogTitle>
          {formatMessage({ id: "connect_to_adjacent_stop_title" })}
        </DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <div style={{ margin: 10 }}>
              {formatMessage({ id: "connect_to_adjacent_stop_description" })}
            </div>
            {stopPlaceChildren &&
              stopPlaceChildren
                .filter((child) => !this.isCurrentChildStop(child))
                .map((child) => (
                  <AddStopPlaceSuggestionListItem
                    key={child.id}
                    disabled={this.isConnected(child)}
                    onCheck={this.handleChange.bind(this)}
                    checked={
                      this.state.selectedAdjacentStopPlace === child.id ||
                      this.isConnected(child)
                    }
                    suggestion={child}
                  />
                ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose} color="secondary">
            {formatMessage({ id: "cancel" })}
          </Button>
          <Button
            variant="text"
            disabled={this.state.selectedAdjacentStopPlace === "NONE"}
            onClick={() =>
              handleConfirm(
                currentStopPlaceId,
                this.state.selectedAdjacentStopPlace
              )
            }
          >
            {formatMessage({ id: "confirm" })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddAdjacentStopDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

const mapStateToProps = ({ stopPlace, user }) => ({
  stopPlaceChildren: stopPlace.current.children,
  parentStopPlace: stopPlace.current,
  currentStopPlaceId: user.adjacentStopDialogStopPlace,
});

export default connect(mapStateToProps)(injectIntl(AddAdjacentStopDialog));
