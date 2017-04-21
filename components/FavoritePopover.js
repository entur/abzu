import React from 'react'
import { connect } from 'react-redux'
import Popover from 'material-ui/Popover'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import FavoriteManager from '../singletons/FavoriteManager'
import StarIcon from 'material-ui/svg-icons/toggle/star'
import MdDelete from 'material-ui/svg-icons/action/delete'
import { UserActions } from '../actions/'


class FilterPopover extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        open: false,
      }
    }

    handleRequestClose() {
      this.setState({
        open: false
      })
    }

    handleTouchTap(event) {
      event.preventDefault()
      this.setState({
        open: true,
        anchorEl: event.currentTarget,
      })
    }

  handleDeleteFavorite(item) {
    this.props.dispatch(UserActions.removeSearchAsFavorite(item))
    this.setState({
      open: false
    })
  }

    render() {

      const { caption, onItemClick, text } = this.props

      let favorites = new FavoriteManager().getFavorites()

      let popoverstyle = {
        width: 'auto',
        overflowY: "hidden"
      }

      return (
        <div>
          <FlatButton
            onTouchTap={this.handleTouchTap.bind(this)}
            icon={<StarIcon style={{height: 20, width: 20, marginLeft: -1}}/>}
            label={caption}
            labelStyle={{fontSize: 12}}
            />
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={ () => this.handleRequestClose(this.refs)}
            style={popoverstyle}
           >

           <div style={{fontWeight: 600, minWidth: 300, width: 'auto',fontSize: '1em', padding: 15}}>
             {text.title}
          </div>
           { favorites.length
              ? favorites.map( (item, index) =>  {
               return (
                 <MenuItem
                   rightIcon={
                     <MdDelete
                      onClick={ e => { e.stopPropagation(); this.handleDeleteFavorite(item) }}
                   />
                   }
                   key={'favorite' + index}
                   style={{
                     cursor: 'pointer',
                     background: '#fff'
                   }}
                   onClick={() => { this.handleRequestClose(); onItemClick(item) }}
                  >
                   {`${item.title}`}
                 </MenuItem>
                )
             })
             : <div
                style={{padding: 10, margin: 'auto', lineHeight: 1.5, width: 300, fontSize: 14}}
                >
                {text.noFavoritesFoundText}
              </div>
         }
            </Popover>
        </div>
      )
    }
}

export default connect(null)(FilterPopover)
