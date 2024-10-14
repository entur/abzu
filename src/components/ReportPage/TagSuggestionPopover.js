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
import FlatButton from "@mui/material/Button";
import { getTagsByName } from "../../actions/TiamatActions";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Checkbox from "@mui/material/Checkbox";
import ShowMoreMenuFooter from "./ShowMoreMenuFooter";
import { injectIntl } from "react-intl";
import TextField from "@mui/material/TextField";
import MdAdd from "@mui/icons-material/Add";
import { connect } from "react-redux";
import { FormControlLabel, Popover } from "@mui/material";
import Typography from "@mui/material/Typography";

class TagSuggestionPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
      tags: [],
      showMore: false,
      filterText: "",
    };
  }

  componentDidMount() {
    const { dispatch, intl } = this.props;
    const { locale } = intl;
    const sortByName = (a, b) => a.name.localeCompare(b.name, locale);

    dispatch(getTagsByName("")).then(({ data }) => {
      this.setState({
        tags: data.tags ? data.tags.slice().sort(sortByName) : [],
      });
    });
  }

  getFilteredTags() {
    const { tags, showMore, filterText } = this.state;
    return tags
      .filter(
        (tag) => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1,
      )
      .slice(0, showMore ? tags.length : 7);
  }

  render() {
    const { open, anchorEl, showMore } = this.state;
    const { intl, checkedTags, handleItemOnCheck } = this.props;
    const { formatMessage } = intl;

    const filteredTags = this.getFilteredTags();

    const noTagsFoundStyle = {
      fontSize: "0.8em",
      textStyle: "italic",
      textAlign: "center",
      padding: 10,
    };

    return (
      <div style={{ marginLeft: 10, flex: 1 }}>
        <FlatButton
          variant="contained"
          startIcon={<MdAdd style={{ height: 20, width: 20 }} />}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              open: true,
              anchorEl: e.currentTarget,
            });
          }}
        >
          {formatMessage({ id: "add_tag" })}
        </FlatButton>

        <Menu
          open={open}
          anchorEl={anchorEl}
          onClose={() => {
            this.setState({ open: false });
          }}
          disableAutoFocus={true}
        >
          <TextField
            variant="standard"
            value={this.state.filterText}
            floatingLabelText={formatMessage({ id: "filter_tags_by_name" })}
            style={{ marginTop: -10, padding: 5 }}
            onChange={(e, filterText) => {
              this.setState({
                filterText: filterText,
              });
            }}
          />

          {filteredTags && filteredTags.length ? (
            filteredTags.map((tag, i) => (
              <MenuItem key={"tag-menuitem-" + i} value={tag.name}>
                <FormControlLabel
                  style={{ fontSize: "0.8em" }}
                  control={
                    <Checkbox
                      checked={checkedTags.indexOf(tag.name) > -1}
                      onChange={(e, checked) => {
                        handleItemOnCheck(tag.name, checked);
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "0.9em" }}>
                      {tag.name}
                    </Typography>
                  }
                />
              </MenuItem>
            ))
          ) : (
            <div style={noTagsFoundStyle}>
              {formatMessage({ id: "no_tags_found" })}
            </div>
          )}
          <ShowMoreMenuFooter
            formatMessage={formatMessage}
            showMore={showMore}
            onClick={() => {
              this.setState({ showMore: !showMore });
            }}
          />
        </Menu>
      </div>
    );
  }
}

export default connect()(injectIntl(TagSuggestionPopover));
