import React from 'react'
import RefreshIndicator from 'material-ui/RefreshIndicator'

const Loader = () => {

  const loadingStyle = {
    top: "200px",
    height: "auto",
    width: "380px",
    margin: "20px",
    position: "absolute",
    zIndex: "2",
    padding: "10px"
  }

  return (
    <div style={loadingStyle}>
      <RefreshIndicator
        size={50}
        left={70}
        top={0}
        status="loading"
        />
    </div>
  )

}

export default Loader
