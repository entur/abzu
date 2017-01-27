import React, { PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

class ConfirmDialog extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    messagesById: PropTypes.object.isRequired
  }

  render() {

    const { open, handleClose, handleConfirm, intl, messagesById } = this.props
    const { formatMessage } = intl

    const confirmDialogTranslation = {
      title: formatMessage({id: messagesById.title}),
      body: formatMessage({id: messagesById.body}),
      confirm: formatMessage({id: messagesById.confirm}),
      cancel: formatMessage({id: messagesById.cancel})
    }

    const actions = [
      <FlatButton
        label={confirmDialogTranslation.cancel}
        primary={true}
        onTouchTap={handleClose}
      />,
      <FlatButton
        label={confirmDialogTranslation.confirm}
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleConfirm}
      />,
    ]

    return (
      <div>
        <Dialog
          title={confirmDialogTranslation.title}
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={() => { handleClose() }}
        >
          { confirmDialogTranslation.body }
        </Dialog>
      </div>
    )
  }
}

export default ConfirmDialog