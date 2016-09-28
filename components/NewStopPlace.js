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

    return (
      <div style={{background: "#f5fefa", border: "1px dotted black", padding: "5px"}}>
        <IconButton
          style={{float: "right"}}
          onClick={this.handleOnClick.bind(this)}
          iconClassName="material-icons">
          clear
        </IconButton>
        <h3>Du lager nå et nytt stoppested</h3>
        <span style={{fontSize: ".8em"}}>Dobbelklikk på kartet for å sette lokasjon.</span>
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
