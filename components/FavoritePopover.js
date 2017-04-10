import React from 'react'
import Popover from 'material-ui/Popover'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import FavoriteManager from '../singletons/FavoriteManager'
import StarIcon from 'material-ui/svg-icons/toggle/star'

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

    render() {

      const { caption, onItemClick, text } = this.props

      let favorites = new FavoriteManager().getFavorites()

      let popoverstyle = {
        width: 'auto',
        overflowY: "hidden"
      }

      return (
        <div>
          <RaisedButton
            onTouchTap={this.handleTouchTap.bind(this)}
            icon={<StarIcon/>}
            label={caption}
            style={{marginBottom: 5}}
            />
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={ () => this.handleRequestClose(this.refs)}
            style={popoverstyle}
           >

           <div style={{fontWeight: 600, minWidth: 300, width: 'auto',fontSize: '1.2em', padding: 15}}>
             {text.title}
          </div>

           { favorites.length

              ? favorites.map( (item, index) =>  {
               return (
                 <MenuItem
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
                style={{padding: 15, margin: 'auto', lineHeight: 1.5, width: 300}}
                >
                {text.noFavoritesFoundText}
              </div>
         }
            </Popover>
        </div>
      )
    }
}

export default FilterPopover
