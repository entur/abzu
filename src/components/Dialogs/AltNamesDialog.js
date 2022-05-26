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

import React from "react";
import { connect } from "react-redux";
import MdDelete from "material-ui/svg-icons/action/delete";
import * as altNameConfig from "../../config/altNamesConfig";
import MdEdit from "material-ui/svg-icons/editor/mode-edit";
import IconButton from "material-ui/IconButton";
import { StopPlaceActions } from "../../actions/";
import ConfirmDialog from "./ConfirmDialog";
import { getPrimaryColor } from "../../config/themeConfig";
import NewAltName from "./NewAltName";
import EditAltName from "./EditAltName";
import DialogHeader from "./DialogHeader";

class AltNamesDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "",
      value: "",
      type: "",
      confirmDialogOpen: false,
      isEditing: false,
      editingId: null,
    };
  }

  handleAddPendingAltName() {
    const { pendingPayLoad, pendingRemoveAltNameIndex } = this.state;
    const { dispatch } = this.props;

    dispatch(StopPlaceActions.addAltName(pendingPayLoad));
    dispatch(StopPlaceActions.removeAltName(pendingRemoveAltNameIndex));

    this.setState({
      lang: "",
      value: "",
      type: "",
      confirmDialogOpen: false,
      pendingRemoveAltNameIndex: -1,
      pendingPayLoad: null,
    });
  }

  handleEditAltName(lang, value, type, id) {
    const payload = {
      nameType: type,
      lang,
      value,
      id,
    };

    const conflictFoundIndex = this.getConflictingIndex(lang, type);

    if (conflictFoundIndex > -1 && conflictFoundIndex !== id) {
      this.setState({
        confirmDialogOpen: true,
        pendingPayLoad: payload,
        pendingRemoveAltNameIndex: conflictFoundIndex,
      });
    } else {
      this.props.dispatch(StopPlaceActions.editAltName(payload));
    }
  }

  getConflictingIndex(languageString, nameTypeString) {
    const { altNames } = this.props;
    let conflictFoundIndex = -1;

    for (let i = 0; i < altNames.length; i++) {
      let altName = altNames[i];
      if (
        altName.name &&
        nameTypeString === "translation" &&
        altName.name.lang === languageString &&
        altName.nameType === nameTypeString
      ) {
        conflictFoundIndex = i;
        break;
      }
    }
    return conflictFoundIndex;
  }

  handleAddAltName() {
    const { lang, value, type } = this.state;
    const { dispatch } = this.props;

    const payload = {
      nameType: type,
      lang: lang,
      value: value,
    };

    const conflictFoundIndex = this.getConflictingIndex(lang, type);

    if (conflictFoundIndex > -1) {
      this.setState({
        confirmDialogOpen: true,
        pendingPayLoad: payload,
        pendingRemoveAltNameIndex: conflictFoundIndex,
      });
    } else {
      dispatch(StopPlaceActions.addAltName(payload));

      this.setState({
        lang: "",
        value: "",
        type: "",
        confirmDialogOpen: false,
      });
    }
  }

  handleRemoveName(index) {
    this.props.dispatch(StopPlaceActions.removeAltName(index));
  }

  handleEdit(index) {
    this.setState({
      isEditing: true,
      editingId: index,
    });
  }

  getAltNameById() {
    const { editingId } = this.state;
    const { altNames = [] } = this.props;
    if (editingId !== null) {
      return altNames[editingId];
    }
  }

  getNameTypeByLocale(nameType) {
    if (altNameConfig.allNameTypes.includes(nameType)) {
      return this.props.intl.formatMessage({
        id: `altNamesDialog.nameTypes.${nameType}`,
      });
    }
  }

  getLangByLocale(lang) {
    if (altNameConfig.languages.includes(lang)) {
      return this.props.intl.formatMessage({
        id: `altNamesDialog.languages.${lang}`,
      });
    }
  }

  render() {
    const { open, intl, altNames = [], handleClose, disabled } = this.props;
    const { formatMessage } = intl;
    const { isEditing, lang, type, value, confirmDialogOpen, editingId } =
      this.state;

    if (!open) return null;

    const translations = {
      alternativeNames: formatMessage({ id: "alternative_names" }),
      noAlternativeNames: formatMessage({ id: "alternative_names_no" }),
      addAltName: formatMessage({ id: "alternative_names_add" }),
      nameType: formatMessage({ id: "name_type" }),
      language: formatMessage({ id: "language" }),
      value: formatMessage({ id: "name" }),
      add: formatMessage({ id: "add" }),
      editing: formatMessage({ id: "editing" }),
      update: formatMessage({ id: "update" }),
      notAssigned: formatMessage({ id: "not_assigned" }),
    };

    const style = {
      position: "fixed",
      left: 408,
      top: 92,
      background: "#fff",
      border: "1px solid black",
      width: 350,
      zIndex: 999,
    };

    const itemStyle = {
      flexBasis: "100%",
      textAlign: "left",
      marginRight: 5,
    };

    const confirmDialogCaptions = {
      title: "overwrite_alt_name_title",
      body: "overwrite_alt_name_body",
      confirm: "overwrite_alt_name_confirm",
      cancel: "overwrite_alt_name_cancel",
    };

    return (
      <div style={style}>
        <ConfirmDialog
          open={confirmDialogOpen}
          handleClose={() => {
            this.setState({ confirmDialogOpen: false });
          }}
          handleConfirm={this.handleAddPendingAltName.bind(this)}
          intl={intl}
          messagesById={confirmDialogCaptions}
        />
        <DialogHeader
          title={translations.alternativeNames}
          handleClose={handleClose}
        />
        <div
          style={{
            width: "100%",
            fontSize: 12,
            overflowY: "overlay",
            maxHeight: 400,
            marginLeft: 5,
          }}
        >
          {altNames.map((an, i) => {
            return (
              <div
                key={"altName-" + i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 10,
                  justifyContent: "space-between",
                  lineHeight: 2,
                }}
              >
                <div style={itemStyle}>
                  {this.getNameTypeByLocale(an.nameType) ||
                    translations.notAssigned}
                </div>
                <div style={itemStyle}>{an.name.value}</div>
                <div style={itemStyle}>
                  {this.getLangByLocale(an.name.lang) ||
                    translations.notAssigned}
                </div>
                {!disabled ? (
                  <div style={{ display: "flex" }}>
                    <IconButton
                      onClick={() => {
                        this.handleEdit(i);
                      }}
                    >
                      <MdEdit color={getPrimaryColor()} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        this.handleRemoveName(i);
                      }}
                    >
                      <MdDelete color="rgb(223, 84, 74)" />
                    </IconButton>
                  </div>
                ) : null}
              </div>
            );
          })}
          {!altNames.length ? (
            <div
              style={{ width: "100%", textAlign: "center", marginBottom: 10 }}
            >
              {" "}
              {translations.noAlternativeNames}
            </div>
          ) : null}
        </div>
        {!disabled && isEditing ? (
          <EditAltName
            translations={translations}
            handleEditAltName={this.handleEditAltName.bind(this)}
            data={this.getAltNameById()}
            formatMessage={formatMessage}
            editingId={editingId}
            handleClose={() => {
              this.setState({
                isEditing: false,
                editingId: null,
              });
            }}
          />
        ) : (
          <NewAltName
            translations={translations}
            handleAddAltName={this.handleAddAltName.bind(this)}
            handleTypeChange={(event, key, type) => {
              this.setState({ type });
            }}
            onLanguageChange={(event, key, lang) => {
              this.setState({ lang });
            }}
            onValueChange={(event, value) => {
              this.setState({ value });
            }}
            lang={lang}
            type={type}
            formatMessage={formatMessage}
            value={value}
            valid={!!lang && !!type && !!value}
          />
        )}
      </div>
    );
  }
}

export default connect(null)(AltNamesDialog);
