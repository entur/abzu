import React from 'react'
import ModalityIcon from '../components/ModalityIcon'
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/MenuItem'
import ImportedId from '../components/ImportedId'
import stopTypes from './stopTypes'
import { MapActions } from '../actions/'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'
import MdMore from 'material-ui/svg-icons/navigation/expand-more'
import MdLess from 'material-ui/svg-icons/navigation/expand-less'
import FlatButton from 'material-ui/FlatButton'

class EditstopBoxHeader extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      stopTypeOpen: false,
      name: props.stopPlace.name || '',
      description: props.stopPlace.description || '',
    }

    this.updateStopName = debounce( value => {
      this.props.dispatch(MapActions.changeStopName(value))
    }, 200)

    this.updateStopDescription = debounce( value => {
      this.props.dispatch(MapActions.changeStopDescription(value))
    }, 200)
  }

  componentWillReceiveProps(props) {
    this.setState({
      description: props.stopPlace.description || '',
      name: props.stopPlace.name || ''
    })
  }

  handleCloseStopPlaceTypePopover() {
    this.setState({
      stopTypeOpen: false
    })
  }

  handleOpenStopPlaceTypePopover(event) {
    this.setState({
      stopTypeOpen: true,
      anchorEl: event.currentTarget
    })
  }

 handleStopNameChange(event) {

    const name = event.target.value
    this.setState({
      name: name
    })

    this.updateStopName(name)
  }

  handleStopDescriptionChange(event) {

    const description = event.target.value
    this.setState({
      description: description
    })

    this.updateStopDescription(description)
  }


  handleStopTypeChange(value) {
    this.handleCloseStopPlaceTypePopover()
    this.props.dispatch(MapActions.changeStopType(value))
  }

  render() {

    const fixedHeader = {
      position: "relative",
      display: "block"
    }

    const { stopPlace, intl, expanded, showLessStopPlace, showMoreStopPlace } = this.props
    const { formatMessage, locale } = intl
    const { name, description } = this.state

    return (
      <div style={fixedHeader}>
        <ImportedId id={stopPlace.importedId} text={formatMessage({id: 'local_reference'})}/>
        <TextField
          hintText={formatMessage({id: 'name'})}
          floatingLabelText={formatMessage({id: 'name'})}
          style={{width: 295}}
          value={name}
          onChange={this.handleStopNameChange.bind(this)}
        />
        <IconButton
          style={{marginLeft: 30, borderBottom: '1px dotted grey'}}
          onClick={(e) => { this.handleOpenStopPlaceTypePopover(e) }}
        >
          <ModalityIcon
            type={ stopPlace.stopPlaceType }
          />
        </IconButton>
        <Popover
          open={this.state.stopTypeOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleCloseStopPlaceTypePopover.bind(this)}
          animation={PopoverAnimationVertical}
        >
          { stopTypes[locale].map( (type, index) =>
            <MenuItem
              key={'stopType' + index}
              value={type.value}
              style={{padding: '0px 10px'}}
              primaryText={type.name}
              onClick={() => { this.handleStopTypeChange(type.value) }}
              secondaryText={(
                <ModalityIcon
                  iconStyle={{float: 'left', marginLeft: -18, marginTop: 9}}
                  type={type.value}
                />)}
            />
          ) }
        </Popover>
        <TextField
          hintText={formatMessage({id: 'description'})}
          floatingLabelText={formatMessage({id: 'description'})}
          style={{width: 295, marginTop: -10}}
          value={description}
          onChange={this.handleStopDescriptionChange.bind(this)}
        />
        <div style={{float: 'right', marginTop: 5}}>
          { expanded
            ? <FlatButton
              icon={<MdLess/>}
              style={{margin: '8 5', zIndex: 999}}
              onClick={() => showLessStopPlace()}
            />
            :
            <FlatButton
              icon={<MdMore/>}
              style={{margin: '8 5', zIndex: 999}}
              onClick={() => showMoreStopPlace()}
            />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  stopPlace: state.stopPlace.current
})



export default connect(mapStateToProps)(EditstopBoxHeader)