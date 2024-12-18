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

import MdClose from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { Component } from "react";
import AddTagDialog from "./AddTagDialog";
import TagItem from "./TagItem";

class TagsDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  handleDeleteTag(name, idReference) {
    const { removeTag, getTags } = this.props;
    this.setState({ isLoading: true });

    removeTag(name, idReference)
      .then((result) => {
        getTags(idReference)
          .then((result) => {
            this.setState({ isLoading: false });
          })
          .catch((err) => {
            this.setState({ isLoading: false });
          });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const {
      open,
      tags,
      handleClose,
      intl,
      idReference,
      addTag,
      getTags,
      findTagByName,
    } = this.props;
    const { formatMessage } = intl;
    const { isLoading } = this.state;

    if (!open) return null;

    const style = {
      position: "fixed",
      left: 400,
      top: 105,
      background: "#fff",
      border: "1px solid black",
      width: "auto",
      minWidth: 400,
      zIndex: 999,
    };

    return (
      <div style={style}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <div
            style={{
              marginTop: 8,
              marginLeft: 10,
              fontWeight: 600,
            }}
          >
            <div>
              <div>{formatMessage({ id: "tags" })}</div>
              {isLoading && (
                <CircularProgress
                  size={20}
                  left={100}
                  top={15}
                  status="loading"
                />
              )}
            </div>
          </div>
          <IconButton
            style={{ marginRight: 5 }}
            onClick={() => {
              handleClose();
            }}
          >
            <MdClose />
          </IconButton>
        </div>
        <div>
          {tags && tags.length ? (
            tags.map((tag, i) => (
              <div
                key={"divider-" + i}
                style={{ borderBottom: "1px solid #eee" }}
              >
                <TagItem
                  key={"tag-item" + i}
                  handleDelete={this.handleDeleteTag.bind(this)}
                  tag={tag}
                  intl={this.props.intl}
                />
                <div
                  style={{
                    fontSize: "0.8em",
                    padding: "0 25px",
                    color: "#4b4b4b",
                    marginBottom: 2,
                  }}
                >
                  {tag.comment}
                </div>
              </div>
            ))
          ) : (
            <span
              style={{
                paddingBottom: 10,
                textAlign: "center",
                fontSize: "0.9em",
                width: "100%",
                display: "inline-block",
              }}
            >
              {formatMessage({ id: "no_tags" })}
            </span>
          )}
        </div>
        <AddTagDialog
          idReference={idReference}
          addTag={addTag}
          getTags={getTags}
          handleLoading={(isLoading) => {
            this.setState({
              isLoading,
            });
          }}
          intl={this.props.intl}
          findTagByName={findTagByName}
        />
      </div>
    );
  }
}

export default TagsDialog;
