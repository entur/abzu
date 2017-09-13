import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PopupButton extends Component {

  render() {

    const { label, onClick, hidden, style } = this.props;

    if (hidden) return null;

    return (
      <div
        style={Object.assign({
          marginTop: 10,
          cursor: 'pointer',
          textAlign: 'center'
        }, style)}
        onClick={onClick}
      >
        <span className="marker-popup-button">
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
