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

import MdCollapse from "@mui/icons-material/ExpandLess";
import MdExpand from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import React from "react";

class MakeExpandable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleToggle() {
    this.setState((prevState) => ({ expanded: !prevState.expanded }));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.ownerId && nextProps.ownerId) {
      if (this.props.ownerId !== nextProps.ownerId) {
        this.setState({
          expanded: false,
        });
      }
    }
  }

  render() {
    const { hideToggle, style } = this.props;

    let iconButtonStyle = {
      flexBasis: "100%",
      textAlign: "right",
      marginBottom: 5,
      marginTop: -10,
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: 12,
      visibility: hideToggle ? "hidden" : "",
    };

    return (
      <div>
        <div style={style}>
          {this.props.children}
          <div style={iconButtonStyle}>
            <IconButton onClick={this.handleToggle.bind(this)}>
              {this.state.expanded ? <MdCollapse /> : <MdExpand />}
            </IconButton>
          </div>
        </div>
        {this.state.expanded && this.props.expandedContent}
      </div>
    );
  }
}

export default MakeExpandable;
