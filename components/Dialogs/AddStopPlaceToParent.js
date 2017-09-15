import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getChildStopPlaceSuggestions } from '../../modelUtils/leafletUtils';
import AddStopPlaceSuggestionList from './AddStopPlaceSuggestionList';

class AddStopPlaceToParent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checkedItems: [],
    }
  }

  handleOnItemCheck(id, value) {
    const { checkedItems } = this.state;
    let newCheckedItems = checkedItems.slice();

    if (value) {
      newCheckedItems = checkedItems.concat(id);
    } else {
      newCheckedItems = newCheckedItems.filter( item => item !== id);
    }

    this.setState({
      checkedItems: newCheckedItems
    });
  }

  render() {

    const {
      open,
      handleClose,
      handleConfirm,
      intl,
      neighbourStops,
      stopPlaceCentroid,
      stopPlaceChildren,
      tokenParsed
    } = this.props;

    const { formatMessage } = intl;
    const { checkedItems } = this.state;

    let canSave = !!checkedItems.length;

    const suggestions = getChildStopPlaceSuggestions(
      stopPlaceChildren,
      stopPlaceCentroid,
      neighbourStops,
      tokenParsed,
      10
    );

    const actions = [
      <FlatButton
        label={formatMessage({ id: 'change_coordinates_cancel' })}
        primary={true}
        onTouchTap={handleClose}
      />,
      <FlatButton
        label={formatMessage({ id: 'add' })}
        primary={true}
        keyboardFocused={true}
        disabled={!canSave}
        onTouchTap={() => handleConfirm(checkedItems)}
      />
    ];

    return (
      <Dialog actions={actions} open={open} title={formatMessage({id: 'add_stop_place'})}>
        <AddStopPlaceSuggestionList
          suggestions={suggestions}
          checkedItems={checkedItems}
          formatMessage={formatMessage}
          onItemCheck={this.handleOnItemCheck.bind(this)}
        />
      </Dialog>
    );
  }
}

AddStopPlaceToParent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

const mapStateToProps = ({ stopPlace, roles }) => ({
  neighbourStops: stopPlace.neighbourStops,
  stopPlaceCentroid: stopPlace.current.location,
  stopPlaceChildren: stopPlace.current.children,
  stopHasBeenModified: stopPlace.stopHasBeenModified,
  tokenParsed: roles.kc.tokenParsed,
});

export default connect(mapStateToProps)(injectIntl(AddStopPlaceToParent));
