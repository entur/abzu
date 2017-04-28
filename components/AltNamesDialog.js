import React from 'react'
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import MdDelete from 'material-ui/svg-icons/action/delete'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import * as altNameConfig from '../config/altNamesConfig'
import TextField from 'material-ui/TextField'
import MdClose from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton'
import { StopPlaceActions } from '../actions/'

class AltNamesDialog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      lang: 0,
      value: '',
      type: 0
    }
  }

  handleAddAltName() {
    const { lang, value, type } = this.state

    const languageString = Object.keys(altNameConfig.languages)[lang]
    const nameTypeString = Object.keys(altNameConfig.allNameTypes)[type]

    const payLoad = {
      nameType: nameTypeString,
      lang: languageString,
      value: value
    }

    this.props.dispatch(StopPlaceActions.addAltName(payLoad))

    this.setState({
      lang: 0,
      value: '',
      type: 0
    })
  }

  handleRemoveName(index) {
    this.props.dispatch(StopPlaceActions.removeAltName(index))
  }

  render() {

    const { open, intl, altNames = [], handleClose, disabled } = this.props
    const { formatMessage, locale } = intl
    const { lang, value, type } = this.state

    const translations = {
      alternativeNames: formatMessage({id: 'alternative_names'}),
      noAlternativeNames: formatMessage({id: 'alternative_names_no'}),
      addAltName: formatMessage({id: 'alternative_names_add'}),
      nameType: formatMessage({id: 'name_type'}),
      language: formatMessage({id: 'language'}),
      value: formatMessage({id: 'value'}),
      add: formatMessage({id: 'add'})
    }

    if (!open) return null

    const style = {
      position: 'fixed',
      left: 400,
      top: 190,
      background: '#fff',
      border: '1px solid black',
      width: 350,
      zIndex: 999
    }

    const itemStyle = {
      flexBasis: '100%',
      textAlign: 'left',
      marginRight: 5
    }

    return (
      <div style={style}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5}}>
          <div style={{marginTop: 8, fontWeight: 60, marginLeft: 10, fontWeight: 600}}>{ translations.alternativeNames } </div>
          <IconButton style={{marginRight: 5}} onTouchTap={() => { handleClose() }}>
            <MdClose/>
          </IconButton>
        </div>
          <div style={{width: '100%', fontSize: 12, overflowY: 'overlay', maxHeight: 400, marginLeft: 5}}>
            { altNames.map( (an,i) => (
              <div key={"altName-" + i} style={{display: 'flex', alignItems: 'center', padding: 10, justifyContent: 'space-between', lineHeight: 2}}>
                <div style={itemStyle}>{altNameConfig.allNameTypes[an.nameType][locale]}</div>
                <div style={itemStyle}>{an.name.value}</div>
                <div style={itemStyle}>{altNameConfig.languages[an.name.lang][locale]}</div>
                { !disabled
                  ? <div>
                    <IconButton width="10" onTouchTap={() => { this.handleRemoveName(i) }}>
                      <MdDelete/>
                    </IconButton>
                  </div>
                  : null
                }
              </div>
            ))}
            { !altNames.length
              ? <div style={{width: '100%', textAlign: 'center'}}> { translations.noAlternativeNames } </div>
              : null
            }
          </div>
        { !disabled ?
          <div style={{background: 'rgba(33, 150, 243, 0)', border: '1px dotted', padding: 20, marginTop: 10}}>
            <div style={{fontWeight: 600, fontSize: 12, textAlign: 'center', width: '100%'}}>
              { translations.addAltName }
            </div>
            <SelectField
              style={{marginTop: -10}}
              fullWidth={true}
              floatingLabelText={translations.nameType}
              value={type}
              onChange={ (e, value) => { this.setState({type: value}) }}
            >
              {
                altNameConfig.supportedNameTypes.map( (type, index) => (
                  <MenuItem
                    key={"type-" + type.value}
                    value={index}
                    primaryText={type.name[locale]}
                  />
                ))
              }
            </SelectField>
            <SelectField
              style={{marginTop: -10}}
              fullWidth={true}
              floatingLabelText={translations.language}
              value={lang}
              onChange={ (e, value) => { this.setState({lang: value}) }}
            >
              {
                Object.keys(altNameConfig.languages).map( (key,index) =>  (
                  <MenuItem
                    key={"lang-" + index}
                    value={index}
                    primaryText={altNameConfig.languages[key][locale]}
                  />
                ))
              }
            </SelectField>
            <TextField
              fullWidth={true}
              hintText={translations.value}
              value={value}
              onChange={ (event, value) => { this.setState({value: value}) }}
            />
            <FlatButton
              style={{marginTop: 10, width: '100%', textAlign: 'center'}}
              disabled={!value}
              primary={true}
              onTouchTap={this.handleAddAltName.bind(this)}
            >
              { translations.add }
            </FlatButton>
          </div>
          : null
        }
      </div>
    )
  }
}

export default connect(null)(AltNamesDialog)