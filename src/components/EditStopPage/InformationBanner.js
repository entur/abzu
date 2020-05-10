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
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import InformationIcon from 'material-ui/svg-icons/action/info';

class InformationBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    ingress: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    closeButtonTitle: PropTypes.string.isRequired,
    handleOnClick: PropTypes.func.isRequired,
  };

  handleClose() {
    this.setState({
      open: false,
    });
    this.props.handleOnClick();
  }

  render() {
    const { title, ingress, body, closeButtonTitle } = this.props;
    const { open } = this.state;

    if (!open) return null;

    const informationBannerStyle = {
      zIndex: 10001,
      position: 'absolute',
      background: '#fff',
      width: '99.5%',
      height: 'auto',
      color: '#191919',
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
      fontSize: '0.9em',
      marginBottom: 20,
    };

    const closeStyle = {
      marginTop: 5,
      textAlign: 'centre',
      width: '100%',
      textDecoration: 'underline',
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
          {title}
        </div>
        <div style={ingressStyle}>{ingress}</div>
        <div style={bodyStyle}>{body}</div>
        <FlatButton style={closeStyle} onClick={() => this.handleClose()}>
          {closeButtonTitle}
        </FlatButton>
      </div>
    );
  }
}

export default InformationBanner;
