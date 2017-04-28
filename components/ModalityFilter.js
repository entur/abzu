import React from 'react'
import {connect} from 'react-redux'
import ModalityIcon from './ModalityIcon'
import stopTypes from './stopTypes'
import Checkbox from 'material-ui/Checkbox'
import {UserActions} from '../actions/'
import BusShelter from '../static/icons/facilities/BusShelter'


class ModalityFilter extends React.Component {

  handleOnCheck(checked, value) {
    const {stopTypeFilter, locale, dispatch} = this.props
    let newFilters = stopTypeFilter.slice()

    if (checked) {
      newFilters.push(value)

      // i.e. no filters: all modalities are selected
      if (newFilters.length === stopTypes[locale].length) {
        newFilters = []
      }

    } else {

      if (!newFilters.length) {
        // if no filters are applied, onChange should select this
        newFilters.push(value)
      } else {
        const index = newFilters.indexOf(value)
        if (index > -1) {
          newFilters.splice(index, 1)
        }
      }
    }
    dispatch(UserActions.applyStopTypeSearchFilter(newFilters))
  }

  render() {

    const {locale, stopTypeFilter} = this.props

    const wrapperStyle = {
      display: 'flex',
      padding: 8,
      justifyContent: 'space-between'
    }

    return (
      <div style={wrapperStyle}>
        { stopTypes[locale].map(item => {

          const checked = ( stopTypeFilter.indexOf(item.value) > -1 || !stopTypeFilter.length )

          return (
            <div key={'item-' + item.value}>
              <Checkbox
                checkedIcon={<ModalityIcon svgStyle={{height: 20, width: 20}} type={item.value}/>}
                uncheckedIcon={<ModalityIcon svgStyle={{height: 20, width: 20}}
                                             style={{fill: '#8c8c8c', opacity: '0.8'}} type={item.value}/>}
                style={{width: 'auto'}}
                checked={checked}
                onCheck={(e, v) => {
                  this.handleOnCheck(v, item.value)
                }}
              />
            </div>
          )
        })
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  stopTypeFilter: state.user.searchFilters.stopType
})

export default  connect(mapStateToProps)(ModalityFilter)