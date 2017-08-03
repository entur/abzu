import React from 'react';
import { injectIntl } from 'react-intl';
import InformationIcon from 'material-ui/svg-icons/action/info';
import FlatButton from 'material-ui/FlatButton';
import { enturPrimaryDarker } from '../../config/enturTheme';
import { connect } from 'react-redux';
import { UserActions } from '../../actions/';

class NewStopPlaceInfo extends React.Component {
  handleClose() {
    this.props.dispatch(UserActions.closeSuccessfullyCreatedNewStop());
  }

  createHref(stopPlaceId) {
    const path = window.location.href;
    const lastIndexOfSlash = path.lastIndexOf('/') +1;
    const href = path.substr(0,lastIndexOfSlash) + stopPlaceId;
    return href;
  };

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

    const href = this.createHref(stopPlaceId);

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
