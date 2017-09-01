import React from 'react';
import IconButton from 'material-ui/IconButton';
import { connect } from 'react-redux';
import { UserActions } from '../../actions/';
const newStopIcon = require('../../static/icons/new-stop-icon-2x.png');

class CreateNewStop extends React.Component {
  handleOnClick(e) {
    this.props.dispatch(UserActions.toggleIsCreatingNewStop());
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const { headerText, bodyText } = this.props.text;

    return (
      <div
        style={{
          background: '#fefefe',
          border: '1px dotted #191919',
          padding: 5,
        }}
      >
        <div style={{ marginLeft: 10 }}>
          <IconButton
            style={{ float: 'right' }}
            onClick={this.handleOnClick.bind(this)}
            iconClassName="material-icons"
          >
            remove
          </IconButton>
          <h4>
            <img
              style={{
                height: 25,
                width: 'auto',
                marginRight: 10,
                verticalAlign: 'middle',
              }}
              src={newStopIcon}
            />
            {headerText}
          </h4>
          <span style={{ fontSize: '0.9em' }}>
            {bodyText}
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isCreatingNewStop: state.user.isCreatingNewStop,
});

export default connect(mapStateToProps)(CreateNewStop);
