import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MdClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';

class DialogHeader extends Component {
  render() {

    const { title, handleClose } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 5
        }}
      >
        <div
          style={{
            marginTop: 8,
            marginLeft: 10,
            fontWeight: 600
          }}
        >
          {title}
          {' '}
        </div>
        <IconButton
          style={{ marginRight: 5 }}
          onTouchTap={handleClose}
        >
          <MdClose />
        </IconButton>
      </div>
    );
  }
}

DialogHeader.propTypes = {
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default DialogHeader;
