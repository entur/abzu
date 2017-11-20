import React, {Component} from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { getGroupOfStopPlaceBy } from '../graphql/Actions';
import GroupOfStopPlaceMap from '../components/GroupOfStopPlace/GroupOfStopPlaceMap';
import EditGroupOfStopPlace from '../components/GroupOfStopPlace/EditGroupOfStopPlace';
import Loader from '../components/Dialogs/Loader';


class GroupOfStopPlaces extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoadingGroup: false
    };
  }

  handleLoading(isLoadingGroup) {
    this.setState({
      isLoadingGroup
    });
  };

  componentDidMount() {
    const idFromPath = window.location.pathname
      .substring(window.location.pathname.lastIndexOf('/'))
      .replace('/', '');
    const { client } = this.props;

    if (idFromPath) {
      this.handleLoading(true);
      getGroupOfStopPlaceBy(client, idFromPath).then(response => {
        this.handleLoading(false);
      });
    }
  }

  render() {

    const { isLoadingGroup } = this.state;
    const { isFetchingMember } = this.props;

    return (
      <div>
        { isLoadingGroup
          ? <Loader/>
          : <EditGroupOfStopPlace/>
        }
        { isFetchingMember && <Loader/>}
        <GroupOfStopPlaceMap
          position={this.props.position}
          zoom={this.props.zoom}
        />
      </div>
    );
  }
}

const mapStateToProps = ({stopPlacesGroup}) => ({
  position: getPositionFromMembers(stopPlacesGroup.current),
  zoom: stopPlacesGroup.zoom,
  isFetchingMember: stopPlacesGroup.isFetchingMember
});

const getPositionFromMembers = current => {
  if (current.members && current.members.length) {
    return current.members[0].location;
  }
  return null;
};

export default withApollo(connect(mapStateToProps)(GroupOfStopPlaces));
