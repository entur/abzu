import React from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ActionHome from 'material-ui/svg-icons/action/home'
import { Link, browserHistory } from 'react-router'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'

const Header = ({handleNavigateToMain, text, setLanguage}) =>{

  const { signOut, help, title, language, norwegian, english } = text

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
            <MenuItem
              primaryText={language}
              rightIcon={<ArrowDropRight />}
              menuItems={[
                <MenuItem onClick={() => setLanguage('nb')} primaryText={norwegian} />,
                <MenuItem onClick={() => setLanguage('en')} primaryText={english} />,
              ]}
             />
          </IconMenu>
        }
      />
)}

export default Header
