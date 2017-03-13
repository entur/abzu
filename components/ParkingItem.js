import React, { Component, PropTypes } from 'react'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import TextField from 'material-ui/TextField'
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location'
import IconButton from 'material-ui/IconButton'
import { connect } from 'react-redux'

class ParkingItem extends React.Component {

  static propTypes = {
    translations: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    expanded: PropTypes.bool.isRequired,
    parking: PropTypes.object.isRequired
  }


  render() {

    const { parking, translations, expanded, handleToggleCollapse, index } = this.props

    const name = ''
    const capacity = 0

    const removeStyle = {
      float: 'right',
      paddingBottom: 0
    }

    const locationStyle = {
      marginRight: 5,
      verticalAlign: 'text-top',
      height: 16,
      width: 16
    }

    return (
      <div>
        <div className='tabItem'>
          <div style={{float: "left", width: "95%", marginTop: 20, padding: 5}}>
            <MapsMyLocation style={locationStyle} onClick={() => this.props.handleLocateOnMap(parking.location)}/>
            <div style={{display: 'inline-block'}} onClick={() => handleToggleCollapse(index, 'parking')}>
              { translations.parking } { (index+1) }
            </div>
            <div style={{display: 'inline-block'}} onClick={() => handleToggleCollapse(index, 'parking')}>
            </div>
            { !expanded
              ? <NavigationExpandMore
                  onClick={() => handleToggleCollapse(index, 'parking')}
                  style={{float: "right"}}
                />
              : <NavigationExpandLess
                  onClick={() => handleToggleCollapse(index, 'parking')}
                  style={{float: "right"}}
                />
            }
          </div>
        </div>
        { !expanded ? null
          : <div>
          <TextField
            hintText={translations.name}
            floatingLabelText={translations.name}
            defaultValue={name}
            style={{width: "95%", marginTop: -10}}
          />
          <TextField
            hintText={translations.capacity}
            floatingLabelText={translations.capacity}
            defaultValue={capacity}
            type="number"
            style={{width: "95%", marginTop: -10}}
          />
          <IconButton
            iconClassName="material-icons"
            style={removeStyle}
            onClick={this.props.handleRemoveParking}
          >
            delete
          </IconButton>
        </div>
        }
      </div>
    )
  }
}


export default connect(null)(ParkingItem)
