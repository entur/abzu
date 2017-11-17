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
      loading: false
    };
  }

  handleLoading(loading) {
    this.setState({
      loading
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
        console.log("response", response);
        this.handleLoading(false);
      });
    }
  }

  render() {

    const { loading } = this.state;

    return (
      <div>
        { loading
          ? <Loader/>
          : <EditGroupOfStopPlace/>
        }
        <GroupOfStopPlaceMap/>
      </div>
    );
  }
}

const mapStateToProps = ({stopPlace}) => ({
  stopPlace
});

export default withApollo(connect(mapStateToProps)(GroupOfStopPlaces));
