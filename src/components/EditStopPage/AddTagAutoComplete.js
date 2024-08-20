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
import AutoComplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import debounce from "lodash.debounce";
import MenuItem from "@mui/material/MenuItem";
import { toCamelCase } from "../../utils/";
import { injectIntl } from "react-intl";

class AddTagAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      chosen: "",
    };

    this.findTag = debounce((name) => {
      this.props
        .findTagByName(name.toString().toLowerCase())
        .then((response) => {
          this.setState({
            dataSource: response.data.tags,
          });
        });
    }, 500);
  }

  handleSelectedTag(event, text) {
    var tagTextName, tagComment;
    if (text == null) {
      tagTextName = "";
      tagComment = "";
    } else {
      tagTextName = text.text;
      tagComment = text.comment;
    }
    const tagInCamelCase = toCamelCase(tagTextName);
    this.props.handleChooseTag(tagInCamelCase, tagComment);
    this.setState({
      chosen: tagTextName,
    });
  }

  handleBlur(event) {
    const value = event.target.value;
    const { dataSource } = this.state;
    const isFoundInDataSource = dataSource.find(
      (item) => item.name.toString().toLowerCase() === value.toLowerCase(),
    );

    if (value) {
      if (isFoundInDataSource) {
        this.handleSelectedTag({
          text: isFoundInDataSource.name,
        });
      } else {
        this.handleSelectedTag({ text: value });
      }
    }
  }

  getMenuItems(dataSource = [], searchText) {
    let menuItems = [];
    if (!searchText) return menuItems;

    const isFoundInDataSource = dataSource.some(
      (item) =>
        item.name.toString().toLowerCase() ===
        searchText.toString().toLowerCase(),
    );

    if (dataSource.length) {
      const suggestion = {
        text: "TAG_SUGGESTION",
        value: (
          <div key={"tag-menu-suggestion"}>
            <div style={{ fontWeight: 600, fontSize: "0.8em" }}>Forslag:</div>
          </div>
        ),
      };
      menuItems = menuItems.concat(
        suggestion,
        dataSource.map((tag, i) => {
          return {
            text: tag.name,
            comment: tag.comment,
            value: (
              <div
                key={"tag-menu-item" + i}
                style={{ paddingRight: 10, width: "auto" }}
              >
                {tag.name}
              </div>
            ),
          };
        }),
      );
    }

    if (!isFoundInDataSource) {
      menuItems.push({
        text: searchText.toString().toLowerCase(),
        comment: "",
        value: (
          <div
            key={"tag-menu-create"}
            style={{ paddingRight: 10, width: "auto" }}
          >
            <div style={{ borderTop: "1px solid #eee", fontSize: "0.8em" }}>
              <span style={{ fontWeight: 600 }}>{toCamelCase(searchText)}</span>
              <span style={{ marginLeft: 5 }}>
                {this.props.intl.formatMessage({ id: "new_tag_hint" })}
              </span>
            </div>
          </div>
        ),
      });
    }
    return menuItems;
  }

  handleUpdate(event, searchText) {
    this.props.handleInputChange(searchText);
    this.findTag(searchText);
  }

  render() {
    const { dataSource } = this.state;
    const { style, searchText, intl } = this.props;
    const { formatMessage } = intl;
    const menuItems = this.getMenuItems(dataSource, searchText);

    return (
      <AutoComplete
        freeSolo
        value={searchText}
        options={menuItems}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.text
        }
        onChange={this.handleSelectedTag.bind(this)}
        style={{ marginLeft: 10, width: 350 }}
        //filterOptions={(x) => x.text}
        onInputChange={this.handleUpdate.bind(this)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={formatMessage({ id: "tag" })}
            variant="standard"
          />
        )}
      ></AutoComplete>
    );
  }
}

export default injectIntl(AddTagAutoComplete);
