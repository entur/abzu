/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
 You may obtain a copy of the Licence at:

 https://joinup.ec.europa.eu/software/page/eupl

 Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the Licence for the specific language governing permissions and
 limitations under the Licence. */


import React, {Component} from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { getGroupOfStopPlacesBy } from '../graphql/Actions';
import GroupOfStopPlaceMap from '../components/GroupOfStopPlace/GroupOfStopPlaceMap';
import EditGroupOfStopPlace from '../components/GroupOfStopPlace/EditGroupOfStopPlace';
import Loader from '../components/Dialogs/Loader';
import GroupErrorDialog from '../components/Dialogs/GroupErrorDialog';
import { UserActions } from '../actions/';

class GroupOfStopPlaces extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoadingGroup: false,
      errorDialog: {
        open: false,
        type: 'NOT_FOUND'
      }
    };
  }

  handleLoading(isLoadingGroup) {
    this.setState({
      isLoadingGroup
    });
  };

  handleErrorDialogClose() {
    this.props.dispatch(
      UserActions.navigateTo('/','')
    );
    this.setState({
      errorDialog: {
        open: false,
        type: 'NOT_FOUND'
      }
    });
  };

  componentDidMount() {
    const idFromPath = window.location.pathname
      .substring(window.location.pathname.lastIndexOf('/'))
      .replace('/', '');
    const { client } = this.props;

    if (idFromPath) {
      this.handleLoading(true);
      getGroupOfStopPlacesBy(client, idFromPath).then(({data}) => {
        this.handleLoading(false);
        if (data.groupOfStopPlaces && !data.groupOfStopPlaces.length) {
          this.setState({
            errorDialog: {
              open: true,
              type: 'NOT_FOUND'
            }
          });
        }
      }).catch(err => {
        this.setState({
          errorDialog: {
            open: true,
            type: 'SERVER_ERROR'
          }
        });
      });
    }
  }

  render() {

    const { isLoadingGroup, errorDialog } = this.state;
    const { isFetchingMember } = this.props;

    return (
      <div>
        { (isLoadingGroup || errorDialog.open)
          ? <Loader/>
          : <EditGroupOfStopPlace/>
        }
        { isFetchingMember && <Loader/>}
        <GroupOfStopPlaceMap
          position={this.props.position}
          zoom={this.props.zoom}
        />
        <GroupErrorDialog
          open={errorDialog.open}
          errorType={errorDialog.type}
          handleOK={this.handleErrorDialogClose.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = ({stopPlacesGroup}) => ({
  position: stopPlacesGroup.centerPosition,
  zoom: stopPlacesGroup.zoom,
  isFetchingMember: stopPlacesGroup.isFetchingMember
});

export default withApollo(connect(mapStateToProps)(GroupOfStopPlaces));
