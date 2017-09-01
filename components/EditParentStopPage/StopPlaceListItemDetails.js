import React, {Component} from 'react';
import StopPlaceListItemQuays from './StopPlaceListItemQuays';
import { injectIntl } from 'react-intl';
import MdDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import { UserActions } from '../../actions/';
import { connect } from 'react-redux';

class StopPlaceListItemDetails extends Component {

  handleRemoveStopPlace(stopPlaceId) {
    this.props.dispatch(UserActions.showRemoveStopPlaceFromParent(stopPlaceId));
  }

  render() {

    const { stopPlace } = this.props;

    return (
      <div style={{marginTop: 10}}>
        <StopPlaceListItemQuays quays={stopPlace.quays}/>
        <div style={{padding: 5, textAlign: 'right'}}>
          <IconButton onClick={() => this.handleRemoveStopPlace(stopPlace.id)}>
            <MdDelete/>
          </IconButton>
        </div>
      </div>
    );
  }
}
export default connect(null)(injectIntl(StopPlaceListItemDetails));
