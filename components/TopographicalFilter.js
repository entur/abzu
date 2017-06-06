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

    return (
      <Chip
        key={data.id}
        onRequestDelete={() => this.props.handleDeleteChip(data.id)}
        style={chipStyle}
      >
        <span style={{ color: typeTextColor }}>{data.text}</span>
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
