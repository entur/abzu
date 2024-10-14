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

import React, { Component } from "react";
import StopPlaceListItem from "../EditParentStopPage/StopPlaceListItem";
import { injectIntl } from "react-intl";
import Fab from "@mui/material/Fab";
import ContentAdd from "@mui/icons-material/Add";
import { connect } from "react-redux";
import StopPlacesGroupActions from "../../actions/StopPlacesGroupActions";
import AddMemberToGroup from "../Dialogs/AddMemberToGroup";

class GroupOfStopPlacesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: -1,
      addStopPlaceOpen: false,
    };
  }

  handleRemoveStopPlace(stopPlaceId) {
    this.props.dispatch(
      StopPlacesGroupActions.removeMemberFromGroup(stopPlaceId),
    );
  }

  handleAddMembers(members) {
    const { dispatch } = this.props;
    this.setState({
      addStopPlaceOpen: false,
    });
    dispatch(StopPlacesGroupActions.addMembersToGroup(members));
  }

  render() {
    const { stopPlaces, canEdit } = this.props;
    const { formatMessage } = this.props.intl;
    const { expanded, addStopPlaceOpen } = this.state;

    return (
      <div>
        <div
          style={{
            padding: 5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: ".9em" }}>
            {formatMessage({ id: "stop_places" })}
          </div>
          <Fab
            onClick={() => {
              this.setState({ addStopPlaceOpen: true });
            }}
            disabled={!canEdit}
            mini={true}
            style={{ marginLeft: 20, marginBottom: 10 }}
          >
            <ContentAdd />
          </Fab>
        </div>
        <div style={{ maxHeight: 500, overflow: "auto" }}>
          {stopPlaces.map((stopPlace, i) => (
            <StopPlaceListItem
              key={"group-item-" + i}
              stopPlace={stopPlace}
              handleRemoveStopPlace={this.handleRemoveStopPlace.bind(this)}
              expanded={expanded === i}
              handleExpand={() => {
                this.setState({
                  expanded: i,
                });
              }}
              handleCollapse={() => {
                this.setState({
                  expanded: -1,
                });
              }}
              disabled={false}
            />
          ))}
        </div>
        {!stopPlaces.length && <p>{formatMessage({ id: "no_stop_places" })}</p>}
        {addStopPlaceOpen && (
          <AddMemberToGroup
            open={addStopPlaceOpen}
            handleClose={() => {
              this.setState({ addStopPlaceOpen: false });
            }}
            handleConfirm={this.handleAddMembers.bind(this)}
          />
        )}
      </div>
    );
  }
}

GroupOfStopPlacesList.defaultProps = {
  stopPlaces: [],
};

export default connect(null)(injectIntl(GroupOfStopPlacesList));
