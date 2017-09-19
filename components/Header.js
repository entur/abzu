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

import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Logo from '../static/logo/logo_entur.png';
import MdAccount from 'material-ui/svg-icons/action/account-circle';
import MdLanguage from 'material-ui/svg-icons/action/language';
import MdSettings from 'material-ui/svg-icons/action/settings';
import { UserActions } from '../actions/';
import { getIn } from '../utils';
import MdReport from 'material-ui/svg-icons/content/report';
import MdHelp from 'material-ui/svg-icons/action/help';
import { getTiamatEnv, getEnvColor } from '../config/enturTheme';
import ConfirmDialog from './Dialogs/ConfirmDialog';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirmDialogOpen: false,
      actionOnDone: 'GoToMain'
    };
  }

  goToMain() {
    this.props.dispatch(UserActions.navigateTo('/', ''));
  }

  handleConfirmChangeRoute(next, action) {
    const { stopHasBeenModified, isDisplayingReports, isDisplayingEditStopPlace } = this.props;

    if (isDisplayingReports) {
      next();
    } else if (stopHasBeenModified && isDisplayingEditStopPlace) {
      this.setState({
        isConfirmDialogOpen: true,
        actionOnDone: action
      });
    } else {
      next();
    }
  }

  handleSetLanguage(locale) {
    this.props.dispatch(UserActions.applyLocale(locale));
  }

  handleConfirm() {
    this.setState({
      isConfirmDialogOpen: false
    });

    const { actionOnDone } = this.state;
    switch (actionOnDone) {
      case 'GoToMain':
        this.goToMain();
        break;
      case 'GoToReports':
        this.goToReports();
        break;
      default:
        () => {
          console.info('Invalid action', actionOnDone, ' ignored');
        };
        break;
    }
  }

  handleLogOut() {
    if (this.props.kc) {
      this.props.kc.logout();
    }
  }

  goToReports() {
    this.props.dispatch(UserActions.navigateTo('reports', ''));
  }

  handleToggleMultiPolylines(value) {
    this.props.dispatch(UserActions.togglePathLinksEnabled(value));
  }

  handleToggleCompassBearing(value) {
    this.props.dispatch(UserActions.toggleCompassBearingEnabled(value));
  }

  handleToggleShowExpiredStops(value) {
    this.props.dispatch(UserActions.toggleExpiredShowExpiredStops(value));
  }

  handleToggleMultimodalEdges(value) {
    this.props.dispatch(UserActions.toggleMultimodalEdges(value));
  }

  render() {
    const {
      intl,
      kc,
      isMultiPolylinesEnabled,
      isCompassBearingEnabled,
      showExpiredStops,
      showMultimodalEdges
    } = this.props;
    const { formatMessage, locale } = intl;

    const help = formatMessage({ id: 'help' });
    const title = formatMessage({ id: '_title' });
    const language = formatMessage({ id: 'language' });
    const english = formatMessage({ id: 'english' });
    const norwegian = formatMessage({ id: 'norwegian' });
    const logOut = formatMessage({ id: 'log_out' });
    const mapSettings = formatMessage({ id: 'map_settings' });
    const showPathLinks = formatMessage({ id: 'show_path_links' });
    const showCompassBearing = formatMessage({ id: 'show_compass_bearing' });
    const reportSite = formatMessage({ id: 'report_site' });
    const expiredStopLabel = formatMessage({ id: 'show_expired_stops' });
    const userGuide = formatMessage({ id: 'user_guide' });
    const username = getIn(kc, ['tokenParsed', 'preferred_username'], '');
    const showMultimodalEdgesLabel = formatMessage({id: 'show_multimodal_edges'});

    const tiamatEnv = getTiamatEnv();

    return (
      <div>
        <AppBar
          style={{
            zIndex: 999,
            background: getEnvColor(tiamatEnv)
          }}
          title={
            <div>
              {title}
              {(tiamatEnv === 'test' || tiamatEnv === 'development') &&
                <span style={{ fontSize: 18, marginLeft: 8, color: '#ddffa5' }}>
                  {tiamatEnv}
                </span>}
            </div>
          }
          showMenuIconButton={true}
          iconElementLeft={
            <img
              src={Logo}
              style={{ width: 40, height: 'auto', cursor: 'pointer' }}
              onClick={() =>
                this.handleConfirmChangeRoute(
                  this.goToMain.bind(this),
                  'GoToMain'
                )}
            />
          }
          iconElementRight={
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem
                leftIcon={<MdReport color="#41c0c4" />}
                primaryText={reportSite}
                onClick={() =>
                  this.handleConfirmChangeRoute(
                    this.goToReports.bind(this),
                    'GoToReports'
                  )}
                style={{ fontSize: 12, padding: 0 }}
              />
              <MenuItem
                primaryText={mapSettings}
                rightIcon={<ArrowDropRight />}
                leftIcon={<MdSettings color="#41c0c4" />}
                style={{ fontSize: 12, padding: 0 }}
                desktop={true}
                multiple
                menuItems={[
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() =>
                      this.handleToggleMultiPolylines(!isMultiPolylinesEnabled)}
                    insetChildren
                    desktop={true}
                    multiple
                    checked={isMultiPolylinesEnabled}
                    primaryText={showPathLinks}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() =>
                      this.handleToggleCompassBearing(!isCompassBearingEnabled)}
                    insetChildren
                    desktop={true}
                    multiple
                    checked={isCompassBearingEnabled}
                    primaryText={showCompassBearing}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() =>
                      this.handleToggleShowExpiredStops(!showExpiredStops)}
                    insetChildren
                    desktop={true}
                    multiple
                    checked={showExpiredStops}
                    primaryText={expiredStopLabel}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() =>
                      this.handleToggleMultimodalEdges(!showMultimodalEdges)}
                    insetChildren
                    desktop={true}
                    multiple
                    checked={showMultimodalEdges}
                    primaryText={showMultimodalEdgesLabel}
                  />
                ]}
              />
              <MenuItem
                primaryText={language}
                rightIcon={<ArrowDropRight />}
                leftIcon={<MdLanguage color="#41c0c4" />}
                style={{ fontSize: 12, padding: 0 }}
                menuItems={[
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() => this.handleSetLanguage('nb')}
                    insetChildren
                    primaryText={norwegian}
                    checked={locale === 'nb'}
                  />,
                  <MenuItem
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() => this.handleSetLanguage('en')}
                    insetChildren
                    primaryText={english}
                    checked={locale === 'en'}
                  />
                ]}
              />
              <MenuItem
                leftIcon={<MdHelp color="#41c0c4" />}
                primaryText={
                  <a
                    target="_blank"
                    style={{ textDecoration: 'none', color: '#000' }}
                    href="https://rutebanken.atlassian.net/wiki/pages/viewpage.action?pageId=69735716"
                  >
                    {userGuide}
                  </a>
                }
                style={{ fontSize: 12, padding: 0 }}
              />
              <MenuItem
                leftIcon={<MdAccount color="#41c0c4" />}
                primaryText={`${logOut} ${username}`}
                onClick={() => this.handleLogOut()}
                style={{ fontSize: 12, padding: 0 }}
              />
            </IconMenu>
          }
        />
        <ConfirmDialog
          open={this.state.isConfirmDialogOpen}
          handleClose={() => {
            this.setState({
              isConfirmDialogOpen: false
            });
          }}
          handleConfirm={() => {
            this.handleConfirm();
          }}
          messagesById={{
            title: 'discard_changes_title',
            body: 'discard_changes_body',
            confirm: 'discard_changes_confirm',
            cancel: 'discard_changes_cancel'
          }}
          intl={intl}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  kc: state.roles.kc,
  isMultiPolylinesEnabled: state.stopPlace.enablePolylines,
  isCompassBearingEnabled: state.stopPlace.isCompassBearingEnabled,
  stopHasBeenModified: state.stopPlace.stopHasBeenModified,
  showExpiredStops: state.stopPlace.showExpiredStops,
  isDisplayingReports: state.routing.locationBeforeTransitions.pathname == '/reports',
  isDisplayingEditStopPlace: state.routing.locationBeforeTransitions.pathname.indexOf('/edit/') > -1,
  showMultimodalEdges: state.stopPlace.showMultimodalEdges,
});

export default connect(mapStateToProps)(Header);
