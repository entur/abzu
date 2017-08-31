import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sortNeighbourStopsByDistance } from '../../modelUtils/leafletUtils';
import AddStopPlaceSuggestionList from './AddStopPlaceSuggestionList';
import AcceptChanges from '../EditStopPage/AcceptChanges';


class AddStopPlaceToParent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      changesUnderstood: false,
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
      stopHasBeenModified
    } = this.props;

    const { formatMessage } = intl;
    const { changesUnderstood, checkedItems } = this.state;

    let canSave = !!checkedItems.length;

    if (stopHasBeenModified && !changesUnderstood) {
      canSave = false;
    }

    const suggestions = sortNeighbourStopsByDistance(
      stopPlaceCentroid,
      neighbourStops,
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
      <Dialog actions={actions} open={open} title={'Legg til stoppested'}>
        <AddStopPlaceSuggestionList
          suggestions={suggestions}
          checkedItems={checkedItems}
          onItemCheck={this.handleOnItemCheck.bind(this)}
        />
        {stopHasBeenModified &&
          <AcceptChanges
            checked={changesUnderstood}
            onChange={(e, v) => this.setState({ changesUnderstood: v })}
          />}
      </Dialog>
    );
  }
}

AddStopPlaceToParent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

const mapStateToProps = ({ stopPlace }) => ({
  neighbourStops: stopPlace.neighbourStops,
  stopPlaceCentroid: stopPlace.current.location,
  stopHasBeenModified: stopPlace.stopHasBeenModified
});

export default connect(mapStateToProps)(injectIntl(AddStopPlaceToParent));
