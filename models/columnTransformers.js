import React from 'react'
import StopPlaceLink from '../components/StopPlaceLink'
import ModalityIcon from './../components/ModalityIcon'

export const ColumnTransformersJSX = {
  id: stop => <StopPlaceLink id={stop.id}/>,
  name: stop => stop.name,
  modality: stop => {
    const iconColor = (!stop.stopPlaceType || stop.stopPlaceType === 'other')
      ? 'red' : '#000'
    return (
      <ModalityIcon svgStyle={{color: iconColor}} type={stop.stopPlaceType}/>
    )
  },
  muncipality: stop => stop.topographicPlace,
  county: stop => stop.parentTopographicPlace,
  importedId: stop => stop.importedId.length,
  position: stop => stop.location.join(','),
  quays: stop => stop.quays.length
}

export const ColumnTranformers = {
  ...ColumnTransformersJSX,
  id: stop => stop.id,
  modality: stop => stop.stopPlaceType,
  importedId: stop => stop.importedId.join(','),
  quays: stop => stop.quays.map( quay => quay.id).join(',')
}