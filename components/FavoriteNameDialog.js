import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { UserActions } from '../actions/'

class FavoriteNameDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      titleText: '',
      errorText: ''
    }
  }

  handleClose = () => {
    this.props.dispatch(UserActions.closeFavoriteNameDialog())
  }

  handleSubmit = () => {
    const { titleText } = this.state

    if (!titleText.length) {

      const { formatMessage } = this.props.intl

      this.setState({
        ...this.state, errorText: formatMessage({id: 'field_is_required'})
      })
    } else {
      this.props.dispatch(UserActions.saveSearchAsFavorite(titleText))
    }
  }

  handleChange = (event) => {
    this.setState({
      ...this.state, titleText: event.target.value
    })
  }

  render() {

    const { formatMessage } = this.props.intl
    const { isOpen } = this.props
    const { errorText } = this.state

    const labelTexts = {
      cancel: formatMessage({id: 'cancel'}),
      use: formatMessage({id: 'use'}),
      title_for_favorite: formatMessage({id: 'title_for_favorite'})
    }

    const actions = [
      <FlatButton
        label={labelTexts.cancel}
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
      <FlatButton
        label={labelTexts.use}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit.bind(this)}
      />
    ]

    return (
      <div>
       <Dialog
         title={labelTexts.title_for_favorite}
         actions={actions}
         modal={false}
         open={isOpen}
         onRequestClose={this.handleClose}
       >
       <TextField
        name="favoriteTittel"
        fullWidth={true}
        errorText={errorText}
        onChange={this.handleChange}
       />
       </Dialog>
     </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isOpen: state.userReducer.favoriteNameDialogIsOpen
  }
}

export default injectIntl(connect(mapStateToProps)(FavoriteNameDialog))
