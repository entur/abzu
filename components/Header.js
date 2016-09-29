import React from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import FlatButton from 'material-ui/FlatButton'
import ActionHome from 'material-ui/svg-icons/action/home'
import { Link, browserHistory } from 'react-router'

const Header = (props) =>(

  <AppBar

    title="Stoppestedregister"
    showMenuIconButton={true}
    style={{background: "#2F2F2F", color: "#fff"}}

    iconElementLeft={
      <IconButton
        onTouchTap={() => props.handleNavigateToMain()}
        >
        <ActionHome />
      </IconButton>
    }

    iconElementRight={
      <IconMenu
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Help" />
        <MenuItem primaryText="Sign out" />
      </IconMenu>
    }
  />)

export default Header
