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

import FlatButton from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Component } from "react";
import AddTagAutoComplete from "./AddTagAutoComplete";

class AddTagDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      tagName: "",
      searchText: "",
    };
  }

  handleChooseTag(tagName, comment) {
    if (!tagName) {
      this.setState({
        searchText: "",
      });
      return;
    }
    if (comment) {
      this.setState({
        tagName,
        comment,
        searchText: tagName,
      });
    } else {
      this.setState({
        tagName,
        searchText: tagName,
      });
    }
  }

  handleAddTag() {
    const { comment, tagName } = this.state;
    const { idReference, handleLoading, addTag, getTags } = this.props;

    handleLoading(true);
    addTag(idReference, tagName, comment)
      .then((result) => {
        this.setState({
          comment: "",
          tagName: "",
          searchText: "",
        });
        getTags(idReference)
          .then((response) => {
            handleLoading(false);
          })
          .catch((err) => {
            handleLoading(false);
          });
      })
      .catch((err) => {
        handleLoading(false);
      });
  }

  render() {
    const { comment, tagName, searchText } = this.state;
    const { intl } = this.props;
    const { formatMessage } = intl;

    return (
      <div
        style={{
          borderTop: "1px dotted",
          display: "flex",
          flexDirection: "column",
          marginLeft: 5,
          marginBottom: 10,
          paddingTop: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <AddTagAutoComplete
            style={{ marginLeft: 10, width: 350, paddingTop: 10 }}
            tagName={tagName}
            searchText={searchText}
            handleInputChange={(value) => {
              this.setState({ searchText: value });
            }}
            handleChooseTag={this.handleChooseTag.bind(this)}
            findTagByName={this.props.findTagByName}
          />
        </div>
        <TextField
          variant="standard"
          value={comment}
          label={formatMessage({ id: "comment" })}
          hintText={formatMessage({ id: "comment" })}
          style={{ marginLeft: 10, width: 350, marginTop: 10 }}
          fullWidth={true}
          id={"comment-text"}
          onChange={(e) => this.setState({ comment: e.target.value || "" })}
        />
        <FlatButton
          style={{ marginLeft: 10, width: 350, marginTop: 10 }}
          variant="outlined"
          disabled={!tagName}
          onClick={this.handleAddTag.bind(this)}
        >
          {formatMessage({ id: "add" })}
        </FlatButton>
      </div>
    );
  }
}

export default AddTagDialog;
