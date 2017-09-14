import React, {Component} from 'react';
import StopPlaceListItemQuays from './StopPlaceListItemQuays';
import { injectIntl } from 'react-intl';
import MdDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import { UserActions, StopPlaceActions } from '../../actions/';
import { connect } from 'react-redux';
import MdWarning from 'material-ui/svg-icons/alert/warning';

class StopPlaceListItemDetails extends Component {

  handleRemoveStopPlace(stopPlaceId, notSaved) {
    const { dispatch } = this.props;
    if (notSaved) {
      dispatch(StopPlaceActions.removeChildFromParentStopPlace(stopPlaceId));
    } else {
      dispatch(UserActions.showRemoveStopPlaceFromParent(stopPlaceId));
    }
  }

  render() {

    const { stopPlace, intl, disabled } = this.props;
    const { notSaved } = stopPlace;
    const { formatMessage } = intl;

    return (
      <div style={{marginTop: 10}}>
        <StopPlaceListItemQuays quays={stopPlace.quays} formatMessage={formatMessage}/>
        <div style={{padding: 5, textAlign: 'right', display: 'flex', justifyContent: notSaved ? 'space-between' : 'flex-end'}}>
          { notSaved &&
            <div style={{display: 'flex', alignItems: 'center'}}>
              <MdWarning color="orange"/>
              <span style={{fontSize: '0.8em', fontWeight: 600, marginLeft: 5}}>
                {formatMessage({id: 'unsaved'})}
              </span>
            </div>
          }
          <IconButton
            disabled={disabled}
            onClick={() => this.handleRemoveStopPlace(stopPlace.id, notSaved)}
          >
            <MdDelete/>
          </IconButton>
        </div>
      </div>
    );
  }
}
export default connect(null)(injectIntl(StopPlaceListItemDetails));
