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
import { injectIntl } from 'react-intl';
import InformationIcon from 'material-ui/svg-icons/action/info';
import FlatButton from 'material-ui/FlatButton';
import { enturPrimaryDarker } from '../../config/enturTheme';
import { connect } from 'react-redux';
import { UserActions } from '../../actions/';
import { createStopPlaceHref } from '../../utils/';

class NewStopPlaceInfo extends React.Component {
  handleClose() {
    this.props.dispatch(UserActions.closeSuccessfullyCreatedNewStop());
  }

  render() {
    const { open, stopPlaceId, intl } = this.props;
    const { formatMessage } = intl;
    const translations = {
      close: formatMessage({ id: 'close' }),
      newStopCreated: formatMessage({ id: 'new_stop_created' }),
      newStopCreatedMore: formatMessage({ id: 'new_stop_created_more' }),
      openQuestion: formatMessage({ id: 'open_question' }),
      open: formatMessage({ id: 'open' }),
      openTab: formatMessage({ id: 'open_tab' })
    };

    if (!open) return null;

    const informationBannerStyle = {
      zIndex: 10001,
      position: 'absolute',
      background: '#fff',
      width: '99.5%',
      height: 'auto',
      color: '#191919',
      borderBottom: '1px solid'
    };

    const titleStyle = {
      fontWeight: 600,
      marginTop: 20,
      fontSize: '2.2em',
      textAlign: 'center'
    };

    const ingressStyle = {
      fontSize: '1.1em',
      margin: 20,
      textAlign: 'center'
    };

    const bodyStyle = {
      width: '70%',
      margin: 'auto',
      textAlign: 'center',
      marginBottom: 20,
      fontWeight: 600
    };

    const closeStyle = {
      marginTop: 5,
      textAlign: 'centre',
      width: '100%',
      textDecoration: 'underline'
    };

    const goToStyle = {
      display: 'flex',
      justifyContent: 'center'
    };

    const goToItem = {
      marginRight: 10,
      marginLeft: 10,
      cursor: 'pointer',
      color: enturPrimaryDarker,
      textDecoration: 'none'
    };

    const href = createStopPlaceHref(stopPlaceId);

    return (
      <div style={informationBannerStyle}>
        <div style={titleStyle}>
          <InformationIcon
            style={{
              height: 44,
              width: 'auto',
              color: '#ffae19',
              verticalAlign: 'middle',
              marginBottom: 7,
              paddingRight: 2
            }}
          />
          {translations.newStopCreated}
        </div>
        <div style={bodyStyle}>{'ID: ' + stopPlaceId}</div>
        <div style={ingressStyle}>{translations.newStopCreatedMore}</div>
        <div style={bodyStyle}>{translations.openQuestion}</div>
        <div style={goToStyle}>
          <a style={goToItem} href={href}>{translations.open}</a>
          <a style={goToItem} target="_blank" href={href}>{translations.openTab}</a>
        </div>
        <FlatButton style={closeStyle} onClick={this.handleClose.bind(this)}>
          {translations.close}
        </FlatButton>
      </div>
    );
  }
}

export default injectIntl(connect(null)(NewStopPlaceInfo));
