import React, { PropTypes } from 'react'
import FlatButton from 'material-ui/FlatButton'
import InformationIcon from 'material-ui/svg-icons/action/info'

class InformationBanner extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: true
    }
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    ingress: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    closeButtonTitle: PropTypes.string.isRequired,
    handleOnClick: PropTypes.func.isRequired
  }

  handleClose() {
    this.setState({
      open: false
    })
    this.props.handleOnClick()
  }

  render() {

    const { title, ingress, body, closeButtonTitle } = this.props
    const { open } = this.state

    if (!open) return null

    const informationBannerStyle = {
      zIndex: 10001,
      position: 'absolute',
      background: '#fff',
      width: '99.5%',
      height: 'auto',
      color: '#191919',
    }

    const titleStyle = {
      fontWeight: 600,
      marginTop: 20,
      fontSize: '2.2em',
      textAlign: 'center'
    }

    const ingressStyle = {
      fontSize: '1.1em',
      margin: 20,
      textAlign: 'center'
    }

    const bodyStyle = {
      width: '70%',
      margin: 'auto',
      textAlign: 'center',
      fontSize: '0.9em',
      marginBottom: 20
    }

    const closeStyle = {
      marginTop: 5,
      textAlign: 'centre',
      width: '100%',
      textDecoration: 'underline',
    }

    return (
      <div style={informationBannerStyle}>
        <div style={titleStyle}>
          <InformationIcon style={{height: 44, width: 'auto', color: '#ffae19', verticalAlign: 'middle', marginBottom: 7, paddingRight: 2}}/>
          {title}
        </div>
        <div style={ingressStyle}>{ingress}</div>
        <div style={bodyStyle}>{body}</div>
        <FlatButton style={closeStyle} onClick={() => this.handleClose()}>{closeButtonTitle}</FlatButton>
      </div>
    )
  }
}

export default InformationBanner