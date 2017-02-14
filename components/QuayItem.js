import React, {PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import { MapActions } from '../actions/'
import { connect } from 'react-redux'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location'

class QuayItem extends React.Component {

  static PropTypes = {
    name: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    quay: PropTypes.object.isRequired,
    handleRemoveQuay: PropTypes.func.isRequired,
    handleLocateOnMap: PropTypes.func.isRequired,
    handleToggleCollapse: PropTypes.func.isRequired,
    expanded: PropTypes.bool.isRequired,
  }


  handleDescriptionChange = (event) => {
    const {dispatch, index} = this.props
    dispatch(MapActions.changeElementDescription(index, event.target.value, 'quay'))
  }

  handleWHAChange = (event) => {
    const { dispatch, index } = this.props
    dispatch(MapActions.changeWHA(index, event.target.checked))
  }

  handleNameChange = (event) => {
    const { dispatch, index } = this.props
    dispatch(MapActions.changeElementName(index, event.target.value, 'quay'))
  }

  render() {

    const { quay, translations, name, expanded, index, handleToggleCollapse } = this.props

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

    const quayTitlePrefix = `${translations.quayItemName ? translations.quayItemName : ''} `
    const quayTitleSuffix = `${(name && name.length) ? name : ` - ${translations.undefined}`}, (ID: ${quay.id||'?'})`

    return (

      <div>
        <div className="tabItem">
          <div style={{float: "left", width: "95%", marginTop: 20, padding: 5}}>
            <MapsMyLocation style={locationStyle} onClick={() => this.props.handleLocateOnMap(quay.centroid)}/>
            <div style={{display: 'inline-block'}} onClick={() => handleToggleCollapse(index, 'quay')}>
              {quayTitlePrefix + quayTitleSuffix}
            </div>
            { quay.new ? <span style={{color: 'red', marginLeft: '20px'}}>{" - " + translations.unsaved}</span> : null}
            { !expanded
              ? <NavigationExpandMore
                  onClick={() => handleToggleCollapse(index, 'quay')}
                  style={{float: "right"}}
                />
              : <NavigationExpandLess
                  onClick={() => handleToggleCollapse(index, 'quay')}
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
             value={quay.name}
             style={{width: "95%", marginTop: -10}}
             onChange={e => typeof e.target.value === 'string' && this.handleNameChange(e)}
           />
          <TextField
            hintText={translations.description}
            floatingLabelText={translations.description}
            value={quay.description}
            style={{width: "95%", marginTop: -10}}
            onChange={e => typeof e.target.value === 'string' && this.handleDescriptionChange(e)}
          />
          <Checkbox
            defaultChecked={quay.allAreasWheelchairAccessible}
            label={translations.allAreasWheelchairAccessible}
            onCheck={this.handleWHAChange}
            style={{marginBottom: 10, width: "95%", marginTop: 10}}
            />
          <IconButton
            iconClassName="material-icons"
            onClick={this.props.handleRemoveQuay}
            style={removeStyle}
          >
          delete
          </IconButton>
        </div>
        }
      </div>
    )
  }
}

export default connect(null)(QuayItem)
