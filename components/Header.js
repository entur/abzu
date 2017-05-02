import React from 'react'
import { connect } from 'react-redux'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'
import Logo from '../static/logo/logo_entur.png'
import MdAccount from 'material-ui/svg-icons/action/account-circle'
import MdLanguage from 'material-ui/svg-icons/action/language'
import MdSettings from 'material-ui/svg-icons/action/settings'
import { UserActions } from '../actions/'
import { getIn } from '../utils'

class Header extends React.Component {

  handleNavigateToMain() {
    const { dispatch } = this.props
    dispatch ( UserActions.navigateTo('/', '') )
  }

  handleSetLanguage(locale) {
    const { dispatch } = this.props
    dispatch ( UserActions.applyLocale(locale) )
  }

  handleLogOut() {
    if (this.props.kc) {
      this.props.kc.logout()
    }
  }

  handleToggleMultiPolylines(value) {
    this.props.dispatch(UserActions.toggleMultiPolylinesEnabled(value))
  }

  handleToggleCompassBearing(value) {
    this.props.dispatch(UserActions.toggleCompassBearingEnabled(value))
  }

  render() {

    const { intl, kc, isMultiPolylinesEnabled, isCompassBearingEnabled } = this.props
    const { formatMessage, locale } = intl

    const help = formatMessage({id: 'help'})
    const title = formatMessage({id: '_title'})
    const language = formatMessage({id: 'language'})
    const english = formatMessage({id: 'english'})
    const norwegian = formatMessage({id: 'norwegian'})
    const logOut = formatMessage({id: 'log_out'})
    const mapSettings = formatMessage({id: 'map_settings'})
    const showPathLinks = formatMessage({id: 'show_path_links'})
    const showCompassBearing = formatMessage({id: 'show_compass_bearing'})

    const username = getIn(kc, ['tokenParsed', 'preferred_username'], '')

    return (

      <AppBar
        title={title}
        style={{zIndex: 999}}
        showMenuIconButton={true}
        iconElementLeft={
          <img src={Logo} style={{width: 40, height: 'auto', cursor: 'pointer'}} onClick={() => this.handleNavigateToMain()}/>
        }
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem
              primaryText={mapSettings}
              rightIcon={<ArrowDropRight />}
              leftIcon={<MdSettings color="#41c0c4"/>}
              style={{fontSize: 12, padding: 0}}
              desktop={true}
              multiple
              menuItems={[
                <MenuItem
                  style={{fontSize: 12, padding: 0}}
                  onClick={() => this.handleToggleMultiPolylines(!isMultiPolylinesEnabled)}
                  insetChildren
                  desktop={true}
                  multiple
                  checked={isMultiPolylinesEnabled}
                  primaryText={showPathLinks}
                />,
                <MenuItem
                  style={{fontSize: 12, padding: 0}}
                  onClick={() => this.handleToggleCompassBearing(!isCompassBearingEnabled)}
                  insetChildren
                  desktop={true}
                  multiple
                  checked={isCompassBearingEnabled}
                  primaryText={showCompassBearing}
                />,
              ]}
            />
            <MenuItem
              primaryText={language}
              rightIcon={<ArrowDropRight />}
              leftIcon={<MdLanguage color="#41c0c4"/>}
              style={{fontSize: 12, padding: 0}}
              menuItems={[
                <MenuItem
                  style={{fontSize: 12, padding: 0}}
                  onClick={() => this.handleSetLanguage('nb')}
                  insetChildren
                  primaryText={norwegian}
                  checked={locale === 'nb'}
                />,
                <MenuItem
                  style={{fontSize: 12, padding: 0}}
                  onClick={() => this.handleSetLanguage('en')}
                  insetChildren
                  primaryText={english}
                  checked={locale === 'en'}
                />,
              ]}
            />
            <MenuItem
              leftIcon={<MdAccount color="#41c0c4"/>}
              primaryText={`${logOut} ${username}`}
              onClick={() => this.handleLogOut()}
              style={{fontSize: 12, padding: 0}}
            />
          </IconMenu>
        }
      />
    )
  }
}

const mapStateToProps = state => ({
  kc: state.user.kc,
  isMultiPolylinesEnabled: state.stopPlace.enablePolylines,
  isCompassBearingEnabled: state.stopPlace.isCompassBearingEnabled
})


export default connect(mapStateToProps)(Header)
