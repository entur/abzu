import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Marker, Popup } from 'react-leaflet'

class NewStopMarker extends React.Component {

  render() {

    let { children, position, handleOnClick, handleDragEnd } = this.props

    return (

      <Marker
        ref="newstop-marker" 
        key={"newstop-key" }
        onDragend={(e) => { handleDragEnd(e).bind(this) }}
        draggable={true}
        position={position}
        >
        <Popup>
          <div>
            <span onClick={handleOnClick}>{children}</span>
              <div>Du lager en nytt stoppested. Vil du opprette et stoppested her?
                <button
                  style={{border: "1px solid #000", marginLeft: "2px", background: "#fff", padding: "1px", textAlign: "middle"}}
                  onClick={() => { handleOnClick(position) } }
                  >
                  Opprett nå
                </button>
              </div>
          </div>
        </Popup>
      </Marker>
    )
  }
}

export default NewStopMarker
