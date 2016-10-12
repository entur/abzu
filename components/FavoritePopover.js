import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
import FavoriteManager from '../singletons/FavoriteManager'

class FilterPopover extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        open: false,
      }
    }

    handleRequestClose(refs) {
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

    render() {

      const { items, filter, caption, onItemClick, noFavoritesFoundText } = this.props

      let favorites = new FavoriteManager().getFavorites()

      let popoverstyle = {
        width: 'auto',
        overflowY: "hidden"
      }

      const buttonStyle = {
        marginBottom: 5
      }

      return (
        <div>
          <RaisedButton
            onTouchTap={this.handleTouchTap.bind(this)}
            label={caption}
            style={buttonStyle}
            />
          <Popover
           open={this.state.open}
           anchorEl={this.state.anchorEl}
           anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
           targetOrigin={{horizontal: 'left', vertical: 'top'}}
           onRequestClose={ () => this.handleRequestClose(this.refs)}
           style={popoverstyle}
           >

           { favorites.length

              ? favorites.map( (item, index) =>  {
               return (
                 <MenuItem
                   key={'favorite' + index}
                   style={{
                     cursor: 'pointer',
                     background: '#fff'
                   }}
                   onClick={() => { this.handleRequestClose(this.refs); onItemClick(item) }}
                  >
                   {`${item.title}`}
                 </MenuItem>
                )
             })
             : <div
                style={{padding: 15, margin: 'auto', lineHeight: 1.5, fontWeight: 600, width: 300}}
                >
                {noFavoritesFoundText}
              </div>
         }
            </Popover>
        </div>
      )
    }
}

export default FilterPopover
