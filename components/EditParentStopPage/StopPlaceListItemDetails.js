import React, {Component} from 'react';
import StopPlaceListItemQuays from './StopPlaceListItemQuays';

class StopPlaceListItemDetails extends Component {
  render() {

    const { stopPlace } = this.props;

    return (
      <div>
        <StopPlaceListItemQuays quays={stopPlace.quays}/>
      </div>
    );
  }
}
export default StopPlaceListItemDetails;
