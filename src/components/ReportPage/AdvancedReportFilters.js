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
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FormControlLabel, Popover } from "@mui/material";
import MdMore from "@mui/icons-material/ExpandMore";

class AdvancedReportFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
    };
  }

  render() {
    const {
      formatMessage,
      withoutLocationOnly,
      withDuplicateImportedIds,
      withNearbySimilarDuplicates,
      handleCheckboxChange,
      withTags,
      showFutureAndExpired,
    } = this.props;

    const { open, anchorEl } = this.state;

    const menuItemsStyle = { display: "flex", alignItems: "center" };

    return (
      <div style={{ marginTop: 10, marginLeft: 5 }}>
        <Button
          variant="contained"
          style={{
            marginTop: 10,
            marginLeft: 5,
            transform: "scale(0.9)",
          }}
          onClick={(e) => {
            this.setState({
              open: true,
              anchorEl: e.currentTarget,
            });
          }}
          startIcon={<MdMore style={{ width: 20, height: 20 }} />}
        >
          {formatMessage({ id: "filters_admin" })}
        </Button>

        <Menu
          open={open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            horizontal: "left",
            vertical: "bottom",
          }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
          onClose={() => {
            this.setState({ open: false });
          }}
        >
          <MenuItem style={menuItemsStyle}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showFutureAndExpired}
                  onChange={(e, value) => {
                    handleCheckboxChange("showFutureAndExpired", value);
                  }}
                />
              }
              label={formatMessage({
                id: "show_future_expired_and_terminated",
              })}
            />
          </MenuItem>
          <MenuItem style={menuItemsStyle}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={withoutLocationOnly}
                  onChange={(e, value) => {
                    handleCheckboxChange("withoutLocationOnly", value);
                  }}
                />
              }
              label={formatMessage({
                id: "only_without_coordinates",
              })}
            />
          </MenuItem>
          <MenuItem style={menuItemsStyle}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={withDuplicateImportedIds}
                  onChange={(e, value) => {
                    handleCheckboxChange("withDuplicateImportedIds", value);
                  }}
                />
              }
              label={formatMessage({
                id: "only_duplicate_importedIds",
              })}
            />
          </MenuItem>
          <MenuItem style={menuItemsStyle}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={withNearbySimilarDuplicates}
                  onChange={(e, value) => {
                    handleCheckboxChange("withNearbySimilarDuplicates", value);
                  }}
                />
              }
              label={formatMessage({
                id: "with_nearby_similar_duplicates",
              })}
            />
          </MenuItem>
          <MenuItem style={menuItemsStyle}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={withTags}
                  onChange={(e, value) => {
                    handleCheckboxChange("withTags", value);
                  }}
                />
              }
              label={formatMessage({
                id: "only_with_tags",
              })}
            />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default AdvancedReportFilters;
