import React from 'react'
import IconButton from 'material-ui/IconButton'
import { connect } from 'react-redux'
import { UserActions } from '../actions/'

class NewStopPlace extends React.Component {

  handleOnClick() {
    const { dispatch } = this.props
    dispatch(UserActions.toggleIsCreatingNewStop())
  }

  render() {

    const { headerText, bodyText } = this.props.text

    return (
      <div style={{background: "#f5feeb", border: "1px dotted #191919", padding: "5px"}}>
        <IconButton
          style={{float: "right"}}
          onClick={this.handleOnClick.bind(this)}
          iconClassName="material-icons">
          remove
        </IconButton>
        <h3>{headerText}</h3>
        <span style={{fontSize: ".9em"}}>
          {bodyText}
        </span>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isCreatingNewStop: state.userReducer.isCreatingNewStop
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewStopPlace)
