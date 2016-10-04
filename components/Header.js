import React from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import FlatButton from 'material-ui/FlatButton'
import ActionHome from 'material-ui/svg-icons/action/home'
import { Link, browserHistory } from 'react-router'

const Header = ({handleNavigateToMain, text}) =>{

  const { signOut, help, title } = text

  return (

      <AppBar
        title={title}
        showMenuIconButton={true}
        style={{background: "#2F2F2F", color: "#fff"}}
        iconElementLeft={
          <IconButton
            onTouchTap={() => handleNavigateToMain()}
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
            <MenuItem primaryText={help} />
            <MenuItem primaryText={signOut} />
          </IconMenu>
        }
      />
)}

export default Header
