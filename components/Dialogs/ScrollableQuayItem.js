import React from 'react';
import Code from '../EditStopPage/Code';
import Checkbox from 'material-ui/Checkbox';

class ScrollableQuayItem extends React.Component {
  render() {

    const { quay, checked, handleCheck } = this.props;

    return (
      <div style={{display: 'flex', alignItems: 'center', margin: 10}}>
        <Checkbox style={{width: 10}} checked={checked} onCheck={(e, value) => handleCheck(value, quay.id)}/>
        <Code type="publicCode" value={quay.publicCode} />
        <Code type="privateCode" value={quay.privateCode} />
        <span style={{marginLeft: 10}}>{quay.id}</span>
        <span style={{marginLeft: 10}}>{quay.description}</span>
      </div>
    )
  }
}

export default ScrollableQuayItem;