import React, {PropTypes}  from 'react'
import {TileLayer} from 'react-leaflet'
import reactWMTSLayer from '../plugins/WMTSPlugin'

export default class WMTSLayer extends TileLayer {
  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    gkt: PropTypes.string.isRequired,
  }

  componentWillMount() {
    super.componentWillMount()
    const { baseURL, gkt } = this.props
    this.leafletElement =  new reactWMTSLayer(baseURL, {
      gkt: gkt,
      layers: "toporaster2",
    })
  }
}

