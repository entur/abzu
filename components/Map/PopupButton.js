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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PopupButton extends Component {
  render() {

    const { label, onClick, hidden, style, labelStyle } = this.props;

    if (hidden) return null;

    return (
      <div
        style={Object.assign(
          {
            marginTop: 10,
            cursor: 'pointer',
            textAlign: 'center'
          },
          style
        )}
        onClick={onClick}
      >
        <span className="marker-popup-button" style={labelStyle}>
          {label}
        </span>
      </div>
    );
  }
}

PopupButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  style: PropTypes.object,
  hidden: PropTypes.bool
};

export default PopupButton;
