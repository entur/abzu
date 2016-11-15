import React from 'react'
import { connect }  from 'react-redux'
import Toggle from 'material-ui/Toggle'
import { UserActions } from '../actions/'


class PathLinkBox extends React.Component {

    handleToggleEnableMultiPolylines(event, value) {
        this.props.dispatch(UserActions.toggleMultiPolylinesEnabled(value))
    }

    render() {

        const { isMultiPolylinesEnabled } = this.props

        const boxWrapperStyle = {
            background: '#fff',
            position: 'absolute',
            top: 720,
            padding: 10,
            margin: 20,
            width: 460,
            border: '1px solid #511e12'
        }

        const stopBoxBar = {
            float: 'right',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            top: -10,
            left: 10,
            position:'relative',
            color: '#fff',
            background: '#191919',
            width: '100%',
            textAlign: 'left',
            fontWeight: '0.9em'
        }

        const lines = [

        ]

        return (
            <div style={boxWrapperStyle}>
                <div style={stopBoxBar}>Ganglenker</div>
                <Toggle
                    style={{paddingTop: 5, width: 250, textAlign: 'center'}}
                    label="Vis ganglenker på kart"
                    toggled={isMultiPolylinesEnabled}
                    onToggle={this.handleToggleEnableMultiPolylines.bind(this)}
                    labelStyle={{fontWeight: 600, width: 'initial'}}
                />
                {
                    !isMultiPolylinesEnabled
                    ? null
                    :
                    <div>
                        <ol>
                            { lines.map( (line, index) => {
                                return (<li key={'polyline'+index}>
                                    {line.join(' => ')}
                                </li>)
                            })
                            }
                        </ol>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isMultiPolylinesEnabled: state.editStopReducer.enablePolylines
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PathLinkBox)