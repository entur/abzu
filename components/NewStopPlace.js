import React from 'react'
import IconButton from 'material-ui/IconButton'
import { connect } from 'react-redux'
import { UserActions } from '../actions/'
const newStopIcon = require("../static/icons/new-stop-icon-2x.png")

class NewStopPlace extends React.Component {

  handleOnClick() {
    this.props.dispatch(UserActions.toggleIsCreatingNewStop())
  }

  render() {

    const { headerText, bodyText } = this.props.text

    return (
      <div style={{background: "#fefefe", border: "1px dotted #191919", padding: "5px"}}>
        <IconButton
          style={{float: "right"}}
          onClick={this.handleOnClick.bind(this)}
          iconClassName="material-icons">
          remove
        </IconButton>
        <h3>
          <img style={{height: 30, width: 'auto', marginRight: 10, verticalAlign: 'middle'}} src={newStopIcon}/>
          {headerText}
        </h3>
        <span style={{fontSize: ".9em"}}>
          {bodyText}
        </span>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    isCreatingNewStop: state.user.isCreatingNewStop
  })

export default connect(mapStateToProps)(NewStopPlace)
