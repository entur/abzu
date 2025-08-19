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
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
} from "@mui/material";
import PropTypes from "prop-types";
import { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { getGroupMemberSuggestions } from "../../modelUtils/leafletUtils";
import AddStopPlaceSuggestionList from "./AddStopPlaceSuggestionList";

class AddMemberToGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedItems: [],
      showInactive: false,
    };
  }

  handleOnItemCheck(id, value) {
    const { checkedItems } = this.state;
    let newCheckedItems = checkedItems.slice();

    if (value) {
      newCheckedItems = checkedItems.concat(id);
    } else {
      newCheckedItems = newCheckedItems.filter((item) => item !== id);
    }

    this.setState({
      checkedItems: newCheckedItems,
    });
  }

  handleShowInactiveChange = (event) => {
    this.setState({ showInactive: event.target.checked });
  };

  render() {
    const {
      open,
      intl,
      handleClose,
      handleConfirm,
      groupMembers,
      stopPlaceCentroid,
      neighbourStops,
    } = this.props;

    const { formatMessage } = intl;
    const { checkedItems, showInactive } = this.state;

    const canSave = !!checkedItems.length;

    const allSuggestions = getGroupMemberSuggestions(
      groupMembers,
      stopPlaceCentroid,
      neighbourStops,
      30,
    );

    const suggestions = showInactive
      ? allSuggestions
      : allSuggestions.filter((suggestion) => !suggestion.hasExpired);

    return (
      <Dialog open={open} maxWidth="lg">
        <DialogTitle>{formatMessage({ id: "add_stop_place" })}</DialogTitle>
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
            <FormControlLabel
              control={
                <Switch
                  checked={showInactive}
                  onChange={this.handleShowInactiveChange}
                />
              }
              label={formatMessage({ id: "show_inactive_stops" })}
              sx={{ mb: 1, alignSelf: "flex-start", color: "text.secondary" }}
            />
            <Box
              sx={{
                overflowY: "auto",
                pr: 2,
              }}
            >
              <AddStopPlaceSuggestionList
                suggestions={suggestions}
                checkedItems={checkedItems}
                formatMessage={formatMessage}
                onItemCheck={this.handleOnItemCheck.bind(this)}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose} color="secondary">
            {formatMessage({ id: "change_coordinates_cancel" })}
          </Button>
          <Button
            variant="text"
            disabled={!canSave}
            onClick={() => handleConfirm(checkedItems)}
          >
            {formatMessage({ id: "add" })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddMemberToGroup.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

const mapStateToProps = ({ stopPlace, stopPlacesGroup }) => ({
  groupMembers: stopPlacesGroup.current.members || [],
  stopPlaceCentroid: stopPlacesGroup.centerPosition,
  neighbourStops: stopPlace.neighbourStops || [],
});

export default connect(mapStateToProps)(injectIntl(AddMemberToGroup));
