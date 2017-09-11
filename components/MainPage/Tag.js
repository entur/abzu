import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ToolTippable from '../EditStopPage/ToolTippable';
import { enturPrimary } from '../../config/enturTheme';
import { injectIntl } from 'react-intl';

class Tag extends Component {
  render() {
    const { data, intl } = this.props;
    const { name, comment } = data;
    const { formatMessage } = intl;
    const noComment = formatMessage({id: 'comment_missing'});
    const tagComment = comment || noComment;

    if (!name) return null;

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
          cursor: 'pointer',
          fontSize: '0.7em',
          textTransform: 'uppercase'
        }}
      >
        {name}
      </div>
    )

    return (
      <ToolTippable toolTipText={tagComment}>
        <span>{content}</span>
      </ToolTippable>
    );

  }
}

Tag.propTypes = {
  data: PropTypes.shape({
    created: PropTypes.string,
    name: PropTypes.string.isRequired,
    comment: PropTypes.string
  })
};

export default injectIntl(Tag);
