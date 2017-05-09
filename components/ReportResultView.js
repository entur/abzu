import React from 'react'
import ModalityIcon from './ModalityIcon'


class ReportResultView extends React.Component {

  renderStopPlaceType(stopPlaceType) {
    const iconColor = (!stopPlaceType || stopPlaceType === 'other')
      ? 'red' : '#000'
    return <ModalityIcon svgStyle={{color: iconColor}} type={stopPlaceType} />
  }

  renderStopPlaceLink(id) {
    const url = window.location.origin + window.config.endpointBase + 'edit/' + id
    return (
      <a target="_blank" href={url}>{id}</a>
    )
  }

  render() {

    const { results, activePageIndex } = this.props

    const paginatedResults = getResultsPaginationMap(results)
    const resultItems = paginatedResults[activePageIndex] || []

    const columnStyle = {
      flexBasis: '100%',
      textAlign: 'center',
      marginRight: 5
    }

    const iconColumStyle = {
      textAlign: 'center',
      marginRight: 10
    }

    return (
      <div style={{height: '80%'}}>
        <div style={{marginLeft: 5, fontWeight: 600, fontSize: 12, textAlign: 'center', marginBottom: 10, marginTop: 10}}>
          Showing 20 of { results.length } results 
        </div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', lineHeight: 2}}>

          <div key={'column-header'} style={{display: 'flex', fontWeight: 600, marginLeft: 10}}>
            <div style={iconColumStyle}></div>
            <div style={columnStyle}>Name</div>
            <div style={columnStyle}>Id</div>
            <div style={columnStyle}>County</div>
            <div style={columnStyle}>Municipality</div>
            <div style={columnStyle}>Quays</div>
          </div>

          { resultItems.map( (item, index) => {

            const background = index % 2 ? 'rgba(213, 228, 236, 0.37)' : '#fff'

            return (
              <div key={item.id} style={{display: 'flex', background: background, padding: '0px 10px'}}>
                <div style={iconColumStyle}>{this.renderStopPlaceType(item.stopPlaceType)}</div>
                <div style={columnStyle}>{item.name}</div>
                <div style={columnStyle}>{this.renderStopPlaceLink(item.id)}</div>
                <div style={columnStyle}>{item.parentTopographicPlace}</div>
                <div style={columnStyle}>{item.topographicPlace}</div>
                <div style={columnStyle}>{item.quays.length}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const getResultsPaginationMap = results => {
  if (!results || !results.length) return []

  let paginationMap = []
  for (let i = 0, j = results.length; i < j; i+=20) {
    paginationMap.push(results.slice(i,i+20))
  }
  return paginationMap
}

export default ReportResultView