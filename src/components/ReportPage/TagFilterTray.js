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
import Chip from "@mui/material/Chip";
import TagSuggestionPopover from "./TagSuggestionPopover";

class TagFilterTray extends Component {
  render() {
    const { tags, handleItemOnCheck } = this.props;

    return (
      <div>
        <div style={{ display: "flex" }}>
          <TagSuggestionPopover
            checkedTags={tags}
            handleItemOnCheck={handleItemOnCheck}
          />
          <div style={{ display: "flex", flexWrap: "wrap", flex: 4 }}>
            {tags &&
              tags.map((tag, i) => (
                <Chip
                  key={"tag-filter" + i}
                  deleteIconStyle={{ fill: "#fff" }}
                  sx={
                    "background-color: #ffa500; color: #fff; text-transform: uppercase"
                  }
                  style={{ margin: 3, transform: "scale(0.9)" }}
                  labelStyle={{
                    fontSize: "0.7em",
                    color: "#fff",
                    textTransform: "uppercase",
                  }}
                  label={tag}
                  onDelete={() => handleItemOnCheck(tag, false)}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}
export default TagFilterTray;
