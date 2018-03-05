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


import React from 'react';
import { connect } from 'react-redux';
import MdDelete from 'material-ui/svg-icons/action/delete';
import * as altNameConfig from '../../config/altNamesConfig';
import MdEdit from 'material-ui/svg-icons/editor/mode-edit';
import IconButton from 'material-ui/IconButton';
import { StopPlaceActions } from '../../actions/';
import ConfirmDialog from './ConfirmDialog';
import { getPrimaryColor } from '../../config/themeConfig';
import NewAltName from './NewAltName';
import EditAltName from './EditAltName';
import DialogHeader from './DialogHeader';


class AltNamesDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: 0,
      value: '',
      type: 0,
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
      lang: 0,
      value: '',
      type: 0,
      confirmDialogOpen: false,
      pendingRemoveAltNameIndex: -1,
      pendingPayLoad: null,
    });
  }

  handleEditAltName(lang, value, type, id) {
    const languageString = Object.keys(altNameConfig.languages)[lang];
    const nameTypeString = Object.keys(altNameConfig.allNameTypes)[type];
    const payLoad = {
      nameType: nameTypeString,
      lang: languageString,
      value,
      id
    };

    const conflictFoundIndex = this.getConflictingIndex(languageString, nameTypeString);

    if (conflictFoundIndex > -1 && conflictFoundIndex !== id) {
      this.setState({
        confirmDialogOpen: true,
        pendingPayLoad: payLoad,
        pendingRemoveAltNameIndex: conflictFoundIndex,
      });
    } else {
      this.props.dispatch(StopPlaceActions.editAltName(payLoad));
    }
  }

  getConflictingIndex(languageString, nameTypeString) {
    const { altNames } = this.props;
    let conflictFoundIndex = -1;

    for (let i = 0; i < altNames.length; i++) {
      let altName = altNames[i];
      if (
        altName.name &&
        nameTypeString === 'translation' &&
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

    const languageString = Object.keys(altNameConfig.languages)[lang];
    const nameTypeString = Object.keys(altNameConfig.allNameTypes)[type];

    const payLoad = {
      nameType: nameTypeString,
      lang: languageString,
      value: value,
    };

    const conflictFoundIndex = this.getConflictingIndex(languageString, nameTypeString);

    if (conflictFoundIndex > -1) {
      this.setState({
        confirmDialogOpen: true,
        pendingPayLoad: payLoad,
        pendingRemoveAltNameIndex: conflictFoundIndex,
      });
    } else {
      dispatch(StopPlaceActions.addAltName(payLoad));

      this.setState({
        lang: 0,
        value: '',
        type: 0,
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
      editingId: index
    });
  }

  getAltNameById() {
    const { editingId } = this.state;
    const { altNames = [] } = this.props;
    if (editingId !== null) {
      return altNames[editingId];
    }
  }

  getNameTypeByLocale(nameType, locale) {
    const localeNameType = altNameConfig.allNameTypes[nameType];
    if (localeNameType) {
      return localeNameType[locale];
    }
  };

  getLangByLocale(lang, locale) {
    const localeLang = altNameConfig.languages[lang];
    if (localeLang) {
      return localeLang[locale];
    }
  }

  render() {
    const { open, intl, altNames = [], handleClose, disabled } = this.props;
    const { formatMessage, locale } = intl;
    const { isEditing, lang, type, value, confirmDialogOpen, editingId } = this.state;

    if (!open) return null;

    const translations = {
      alternativeNames: formatMessage({ id: 'alternative_names' }),
      noAlternativeNames: formatMessage({ id: 'alternative_names_no' }),
      addAltName: formatMessage({ id: 'alternative_names_add' }),
      nameType: formatMessage({ id: 'name_type' }),
      language: formatMessage({ id: 'language' }),
      value: formatMessage({ id: 'name' }),
      add: formatMessage({ id: 'add' }),
      editing: formatMessage({ id: 'editing'}),
      update: formatMessage({id: 'update'}),
      notAssigned: formatMessage({id: 'not_assigned'})
    };

    const style = {
      position: 'fixed',
      left: 408,
      top: 92,
      background: '#fff',
      border: '1px solid black',
      width: 350,
      zIndex: 999,
    };

    const itemStyle = {
      flexBasis: '100%',
      textAlign: 'left',
      marginRight: 5,
    };

    const confirmDialogCaptions = {
      title: 'overwrite_alt_name_title',
      body: 'overwrite_alt_name_body',
      confirm: 'overwrite_alt_name_confirm',
      cancel: 'overwrite_alt_name_cancel',
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
            width: '100%',
            fontSize: 12,
            overflowY: 'overlay',
            maxHeight: 400,
            marginLeft: 5,
          }}
        >
          {altNames.map((an, i) => {

            return (
              <div
                key={'altName-' + i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 10,
                  justifyContent: 'space-between',
                  lineHeight: 2,
                }}
              >
                <div style={itemStyle}>
                  {this.getNameTypeByLocale(an.nameType, locale) || translations.notAssigned}
                </div>
                <div style={itemStyle}>{an.name.value}</div>
                <div style={itemStyle}>
                  {this.getLangByLocale(an.name.lang, locale) || translations.notAssigned}
                </div>
                {!disabled
                  ? <div style={{display: 'flex'}}>
                    <IconButton
                      onTouchTap={() => {
                        this.handleEdit(i);
                      }}
                    >
                      <MdEdit color={getPrimaryColor()}
                      />
                    </IconButton>
                    <IconButton
                      onTouchTap={() => {
                        this.handleRemoveName(i);
                      }}
                    >
                      <MdDelete color="rgb(223, 84, 74)"/>
                    </IconButton>
                  </div>
                  : null}
              </div>
            )
          })}
          {!altNames.length
            ? <div
                style={{ width: '100%', textAlign: 'center', marginBottom: 10 }}
              >
                {' '}{translations.noAlternativeNames}
              </div>
            : null}
        </div>
        {!disabled && isEditing ?
          <EditAltName
            translations={translations}
            handleEditAltName={this.handleEditAltName.bind(this)}
            data={this.getAltNameById()}
            locale={locale}
            editingId={editingId}
            handleClose={() => { this.setState({
              isEditing: false,
              editingId: null
            })}}
          />
          :
          <NewAltName
            translations={translations}
            handleAddAltName={this.handleAddAltName.bind(this)}
            handleTypeChange={(e, value) => {
              this.setState({ type: value });
            }}
            onLanguageChange={(e, value) => {
              this.setState({ lang: value });
            }}
            onValueChange={(e, value) => {
              this.setState({ value: value });
            }}
            lang={lang}
            type={type}
            locale={locale}
            value={value}
          />
        }
      </div>
    );
  }
}

export default connect(null)(AltNamesDialog);
