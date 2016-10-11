import React from 'react'
import Chip from 'material-ui/Chip'
import { connect } from 'react-redux'
import { UserActions } from '../actions/'

class TopographicalFilter extends React.Component {

  handleRequestDelete(key) {
    this.props.dispatch(UserActions.deleteChip(key))
  }

  renderChip(data) {
    const isCounty = data.type === 'county'
    const typeColor = isCounty ? '#73919b' : '#cde7eb'
    const typeTextColor = isCounty ? '#fff' : "#000"

    const chipStyle = {
      margin: 4,
      backgroundColor: typeColor
    }

    return (
      <Chip
        key={data.key}
        onRequestDelete={() => this.handleRequestDelete(data.key)}
        style={chipStyle}
      >
        <span style={{color: typeTextColor}}>{data.name}</span>
      </Chip>
    )
  }

  render() {

    const wrapperStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      margin: 5,
      width: '100%'
    }

    return (
      <div style={wrapperStyle}>
       {this.props.topoiChips.map(this.renderChip, this)}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    topoiChips: state.userReducer.searchFilters.topoiChips
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopographicalFilter)
