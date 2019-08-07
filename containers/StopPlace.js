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


import { connect } from 'react-redux';
import React from 'react';
import EditStopMap from '../components/Map/EditStopMap';
import EditStopGeneral from '../components/EditStopPage/EditStopGeneral';
import EditParentGeneral from '../components/EditParentStopPage/EditParentGeneral';
import InformationBanner from '../components/EditStopPage/InformationBanner';
import Information from '../config/information';
import { injectIntl } from 'react-intl';
import InformationManager from '../singletons/InformationManager';
import { allEntities } from '../graphql/Tiamat/queries';
import { withApollo } from 'react-apollo';
import '../styles/main.css';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { UserActions } from '../actions/';
import { getIn } from '../utils';
import NewElementsBox from '../components/EditStopPage/NewElementsBox';
import NewStopPlaceInfo from '../components/EditStopPage/NewStopPlaceInfo';
import LoadingPage from './LoadingPage';


class StopPlace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showErrorDialog: false,
      resourceNotFound: false,
    };
  }

  componentWillUpdate(nextProps) {
    const { stopPlace, intl, originalStopPlace } = nextProps;
    const { formatMessage } = intl;

    let title = '';

    if (stopPlace) {
      if (stopPlace.isNewStop) {
        title = formatMessage({ id: '_title_new_stop' });
      } else {
        if (originalStopPlace.name) {
          title = originalStopPlace.name;
        }
        if (stopPlace.topographicPlace) {
          title += ', ' + stopPlace.topographicPlace;
        }
      }
    }
    document.title = title;
  }
  
  handleOnClickPathLinkInfo() {
    new InformationManager().setShouldPathLinkBeDisplayed(false);
  }

  componentDidMount() {
    const { client, dispatch } = this.props;
    const idFromPath = window.location.pathname
      .substring(window.location.pathname.lastIndexOf('/'))
      .replace('/', '');

    if (idFromPath === 'new' && !this.props.stopPlace) {
      dispatch(UserActions.navigateTo('/', ''));
    }

    if (idFromPath && idFromPath.length && idFromPath && idFromPath !== 'new') {
      client
        .query({
          fetchPolicy: 'network-only',
          query: allEntities,
          variables: {
            id: idFromPath,
          },
        })
        .then(response => {
          if (!response.data.stopPlace.length) {
            this.setState({
              showErrorDialog: true,
              resourceNotFound: true,
            });
          }
        })
        .catch(err => {
          console.error("error fetching stopPlace", err);
          this.setState({
            showErrorDialog: true,
            resourceNotFound: false,
          });
        });
    }
  }

  handleCloseErrorDialog() {
    this.props.dispatch(UserActions.navigateTo('/', ''));
    this.setState({ showErrorDialog: false });
  }

  render() {
    const { isCreatingPolylines, stopPlace, disabled, newStopCreated } = this.props;
    const { resourceNotFound, showErrorDialog } = this.state;
    const { locale, formatMessage } = this.props.intl;

    const idFromPath = window.location.pathname
      .substring(window.location.pathname.lastIndexOf('/'))
      .replace('/', '');

    const actions = [
      <FlatButton
        label={formatMessage({ id: 'cancel' })}
        onClick={this.handleCloseErrorDialog.bind(this)}
      />,
    ];

    const shouldDisplayMessage =
      isCreatingPolylines &&
      new InformationManager().getShouldPathLinkBeDisplayed();

    return (
      <div>
        <Dialog
          modal={false}
          actions={actions}
          open={showErrorDialog}
          onRequestClose={() => {
            this.setState({ showErrorDialog: false });
          }}
        >
          {resourceNotFound
            ? formatMessage({ id: 'error_stopPlace_404' }) + idFromPath
            : formatMessage({ id: 'error_unable_to_load_stop' })}
        </Dialog>
        <NewStopPlaceInfo open={newStopCreated.open} stopPlaceId={newStopCreated.stopPlaceId}/>
        {shouldDisplayMessage &&
          <InformationBanner
              title={Information[locale].path_links.title}
              ingress={Information[locale].path_links.ingress}
              body={Information[locale].path_links.body}
              closeButtonTitle={Information[locale].path_links.closeButtonTitle}
              handleOnClick={this.handleOnClickPathLinkInfo.bind(this)}
            />
          }
        { (!stopPlace && !showErrorDialog) && <LoadingPage/> }
        {stopPlace && !stopPlace.isParent &&
          <div>
            <NewElementsBox disabled={disabled} />
            <EditStopGeneral disabled={disabled} />
            <EditStopMap disabled={disabled} />
          </div>
        }
        {stopPlace && stopPlace.isParent &&
        <div>
          <EditParentGeneral disabled={disabled}/>
          <EditStopMap disabled={disabled} />
        </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isCreatingPolylines: state.stopPlace.isCreatingPolylines,
  stopPlace: state.stopPlace.current || state.stopPlace.newStop,
  disabled: !getIn(state.roles, ['allowanceInfo', 'canEdit'], false),
  newStopCreated: state.user.newStopCreated,
  originalStopPlace: state.stopPlace.originalCurrent
});

const EditPlaceIntl = injectIntl(
  connect(mapStateToProps)(StopPlace),
);

export default withApollo(EditPlaceIntl);
