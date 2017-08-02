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

  render() {

    const { open, stopPlaceId, dispatch } = this.props;

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
      textAlign: 'center',
    };

    const ingressStyle = {
      fontSize: '1.1em',
      margin: 20,
      textAlign: 'center',
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
      textDecoration: 'underline',
    };

    const goToStyle = {
      display: 'flex',
      justifyContent: 'center'
    };

    const goToItem = {
      marginRight: 10,
      marginLeft: 10,
      cursor: 'pointer',
      color: enturPrimaryDarker
    };

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
              paddingRight: 2,
            }}
          />
          {"Nytt stoppested opprettet"}
        </div>
        <div style={bodyStyle}>{"ID: " + stopPlaceId}</div>
        <div style={ingressStyle}>{"Et nytt stoppested er blitt opprettet, og er nå tilgjengelig i stoppestedsregisteret."}</div>
        <div style={bodyStyle}>{"Ønsker du å gå til det nå?"}</div>
        <div style={goToStyle}>
          <div style={goToItem}>Åpne</div>
          <div style={goToItem}>Åpne i ny fane</div>
        </div>
        <FlatButton style={closeStyle} onClick={this.handleClose.bind(this)}>
          Lukk
        </FlatButton>
      </div>
    )

  }
}

export default injectIntl(connect(null)(NewStopPlaceInfo));