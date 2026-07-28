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

import Button from "@mui/material/Button";
import React from "react";
import { connect } from "react-redux";
import { UserActions } from "../../actions/";
import newStopIcon from "../../static/icons/new-stop-icon-2x.png";

class CreateNewStop extends React.Component {
  handleOnClick(e) {
    this.props.dispatch(UserActions.toggleIsCreatingNewStop());
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const { headerText, bodyText } = this.props.text;

    return (
      <div
        style={{
          background: "#fefefe",
          border: "1px dotted #191919",
          padding: 5,
        }}
      >
        <div style={{ marginLeft: 10 }}>
          <Button
            style={{ float: "right" }}
            onClick={this.handleOnClick.bind(this)}
            iconClassName="material-icons"
          >
            remove
          </Button>
          <h4>
            <img
              alt=""
              style={{
                height: 25,
                width: "auto",
                marginRight: 10,
                verticalAlign: "middle",
              }}
              src={newStopIcon}
            />
            {headerText}
          </h4>
          <span style={{ fontSize: "0.9em" }}>{bodyText}</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isCreatingNewStop: state.user.isCreatingNewStop,
});

export default connect(mapStateToProps)(CreateNewStop);
