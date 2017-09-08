import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ToolTippable from '../EditStopPage/ToolTippable';
import { enturPrimary } from '../../config/enturTheme';

class Tag extends Component {
  render() {
    const { name, comment } = this.props.data;

    const content = (
      <div
        style={{
          padding: 5,
          margin: '0 5px 5px 0',
          display: 'inline-block',
          borderRadius: 3,
          height: 12,
          background: enturPrimary,
          color: '#fff',
          width: 'auto',
          fontSize: '0.7em',
          textTransform: 'uppercase'
        }}
      >
        {name}
      </div>
    )

    if (comment) {
      return (
        <ToolTippable toolTipText={comment}>
          {content}
        </ToolTippable>
      );
    } else {
      return {content}
    }
  }
}

Tag.propTypes = {
  data: PropTypes.shape({
    created: PropTypes.string,
    name: PropTypes.string.isRequired,
    comment: PropTypes.string
  })
};
Tag.defaultProps = {};

export default Tag;
