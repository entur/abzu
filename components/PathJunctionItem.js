import React, { Component, PropTypes } from 'react'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import TextField from 'material-ui/TextField'
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location'
import IconButton from 'material-ui/IconButton'

class PathJunctionItem extends React.Component {

  static PropTypes = {
    name: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    pathJunction: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    handleRemovePathJunction: PropTypes.func.isRequired,
    handleLocateOnMap: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { collapsed: !props.pathJunction.new }
  }

  toggleCollapsed() {
    const { collapsed } = this.state
    this.setState({collapsed : !collapsed})
  }

  render() {

    const { collapsed } = this.state
    const { pathJunction, translations } = this.props

    const name = pathJunction.name
    const description = pathJunction.description || ''

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
            <MapsMyLocation style={locationStyle} onClick={() => this.props.handleLocateOnMap(pathJunction.centroid)}/>
            <div style={{display: 'inline-block'}} onClick={() => this.toggleCollapsed()}>
              {name.length ? name : 'N/A'}
            </div>
            <div style={{display: 'inline-block'}} onClick={() => this.toggleCollapsed()}>
            </div>
            { collapsed
              ? <NavigationExpandMore
                  onClick={() => this.toggleCollapsed()}
                  style={{float: "right"}}
            />
              : <NavigationExpandLess
                  onClick={() => this.toggleCollapsed()}
                  style={{float: "right"}}
            />
            }
          </div>
        </div>
        { collapsed ? null
          : <div>
          <TextField
            hintText={translations.name}
            floatingLabelText={translations.name}
            value={name}
            style={{width: "95%", marginTop: -10}}
          />
          <TextField
            hintText={translations.description}
            floatingLabelText={translations.description}
            value={description}
            style={{width: "95%", marginTop: -10}}
          />
          <IconButton
            iconClassName="material-icons"
            style={removeStyle}
            onClick={this.props.handleRemovePathJunction}
          >
            delete
          </IconButton>
        </div>
        }
      </div>
    )
  }
}

export default PathJunctionItem