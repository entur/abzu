import React, { PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TimePicker from 'material-ui/TimePicker'
import DatePicker from 'material-ui/DatePicker'

class SaveDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      time: '',
      date: '',
    }
  }

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    messagesById: PropTypes.object.isRequired
  }

  render() {

    const { open, intl, handleConfirm, handleClose } = this.props
    const { time, date } = this.state

    const actions = [
      <FlatButton
        label={"Cancel"}
        primary={true}
        onTouchTap={handleClose}
      />,
      <FlatButton
        label={"Confirm"}
        primary={true}
        keyboardFocused={true}
        disabled={!time || !date}
        onTouchTap={() => handleConfirm(date, time)}
      />,
    ]

    return (
      <Dialog
        title={"You are making a new version of this stop place"}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={() => { handleClose() }}
        contentStyle={{width: '40%', minWidth: '40%', margin: 'auto'}}
      >
        <div>When is the new version of your stop valid from?</div>
        <div style={{marginTop: 15, textAlign: 'center'}}>
          <DatePicker
            hintText="Date"
            mode="landscape"
            value={date}
            textFieldStyle={{width: '80%'}}
            onChange={(event, value) => { this.setState({date: value})}}
          />
          <TimePicker
            format="24hr"
            hintText="Hour"
            value={time}
            textFieldStyle={{width: '80%'}}
            onChange={(event, value) => { this.setState({time: new Date(new Date(value).setSeconds(0))}) }}
          />
        </div>
        <div style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>Previous version will end at this date and time.</div>
      </Dialog>
    )
  }
}

export default SaveDialog