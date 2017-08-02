import { connect } from 'react-redux';
import React from 'react';
import Loader from '../components/Dialogs/Loader';
import EditStopMap from '../components/Map/EditStopMap';
import EditStopGeneral from '../components/EditStopPage/EditStopGeneral';
import InformationBanner from '../components/EditStopPage/InformationBanner';
import Information from '../config/information';
import { injectIntl } from 'react-intl';
import InformationManager from '../singletons/InformationManager';
import { stopPlaceWithEverythingElse } from '../graphql/Queries';
import { withApollo } from 'react-apollo';
import '../styles/main.css';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { UserActions } from '../actions/';
import { getIn } from '../utils';
import NewElementsBox from '../components/EditStopPage/NewElementsBox';
import NewStopPlaceInfo from '../components/EditStopPage/NewStopPlaceInfo';

class EditStopPlace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showErrorDialog: false,
      resourceNotFound: false,
    };
  }

  componentWillUpdate(nextProps) {
    const { stopPlace, intl } = nextProps;
    const { formatMessage } = intl;

    let title = '';

    if (stopPlace) {
      if (stopPlace.isNewStop) {
        title = formatMessage({ id: '_title_new_stop' });
      } else {
        if (stopPlace.name) {
          title = stopPlace.name;
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
          query: stopPlaceWithEverythingElse,
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
        onTouchTap={this.handleCloseErrorDialog.bind(this)}
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
        {stopPlace
          ? <div>
              <NewElementsBox disabled={disabled} />
              <EditStopGeneral disabled={disabled} />
              <EditStopMap disabled={disabled} />
            </div>
          : <Loader />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isCreatingPolylines: state.stopPlace.isCreatingPolylines,
  stopPlace: state.stopPlace.current || state.stopPlace.newStop,
  disabled: !getIn(state.roles, ['allowanceInfo', 'canEdit'], false),
  newStopCreated: state.user.newStopCreated
});

const EditStopPlaceWithIntl = injectIntl(
  connect(mapStateToProps)(EditStopPlace),
);

export default withApollo(EditStopPlaceWithIntl);
