import React, { PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

class CompassBearingDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      errorText: ''
    }
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    compassBearing: PropTypes.number.isReuired,
    handleConfirm: PropTypes.func.isRequired
  }

  handleInputChange(event, newValue) {
    this.setState({
      compassBearing: newValue
    })
  }

  handleClose() {
    this.setState({
      compassBearing: null,
      errorText: ''
    })
    this.props.handleClose()
  }

  handleConfirm() {

    const compassBearing = this.state ? this.state.compassBearing : this.props.compassBearing

    if (typeof compassBearing === 'undefined') return


    if (!isNaN(compassBearing)) {

      this.props.handleConfirm(Number(compassBearing))

      this.setState({
        compassBearing: null,
        errorText: ''
      })

    } else {
      this.setState({
        errorText: this.props.intl.formatMessage({id: 'change_compass_bearing_invalid'})
      })
    }
  }


  render() {

    const { open, intl } = this.props
    const { formatMessage } = intl
    const compassBearing = this.state.compassBearing || this.props.compassBearing

    const compassBearingTranslation = {
      title: formatMessage({id: 'change_compass_bearing'}),
      body: formatMessage({id: 'change_compass_bearing_help_text'}),
      confirm: formatMessage({id: 'change_compass_bearing_confirm'}),
      cancel: formatMessage({id: 'change_compass_bearing_cancel'})
    }

    const buttonWrapperStyle = {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 20
    }

    const actions = [
      <TextField
        hintText="lat,lng"
        floatingLabelText={formatMessage({id: 'compass_bearing'})}
        style={{display: 'block', margin: 'auto', width: '90%'}}
        value={compassBearing}
        onChange={this.handleInputChange.bind(this)}
        errorText={this.state.errorText}
      />,
      <div style={buttonWrapperStyle}>
        <FlatButton
          label={compassBearingTranslation.cancel}
          primary={false}
          keyboardFocused={true}
          onTouchTap={() => this.handleClose()}
          style={{marginRight: 5}}
        />
        <FlatButton
          label={compassBearingTranslation.confirm}
          primary={true}
          keyboardFocused={true}
          onTouchTap={() => this.handleConfirm()}
        />
      </div>
    ]

    return (
      <div>
        <Dialog
          title={compassBearingTranslation.title}
          actions={actions}
          modal={false}
          open={open}
          contentStyle={{width: '45vw'}}
        >
          { compassBearingTranslation.body }
        </Dialog>
      </div>
    )
  }
}

export default CompassBearingDialog