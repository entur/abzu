import React from 'react'

class ReportFilterBox extends React.Component {

  render() {

    const style = {
      border: '1px solid black',
      ...this.props.style
    }

    return (
      <div style={style}>
        { this.props.children }
      </div>
    )
  }
}

export default ReportFilterBox