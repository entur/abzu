import React from 'react';
import Chip from 'material-ui/Chip';

class TopographicalFilter extends React.Component {

  renderChip(data) {
    const isCounty = data.type === 'county';
    const typeColor = isCounty ? '#73919b' : '#cde7eb';
    const typeTextColor = isCounty ? '#fff' : '#000';

    const chipStyle = {
      margin: 4,
      backgroundColor: typeColor,
    };

    let id = data.id || data.value;

    return (
      <Chip
        key={id}
        onRequestDelete={() => this.props.handleDeleteChip(id)}
        style={chipStyle}
      >
        <span style={{ color: typeTextColor, fontSize: '0.8em' }}>{data.text}</span>
      </Chip>
    );
  }

  render() {
    const style = {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: 10,
      marginBottom: 10,
      width: '100%',
    };

    return (
      <div style={style}>
        {this.props.topoiChips.map(this.renderChip, this)}
      </div>
    );
  }
}

export default TopographicalFilter;
