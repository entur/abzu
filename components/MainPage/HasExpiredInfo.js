import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import Warning from 'material-ui/svg-icons/alert/warning';

class HasExpiredInfo extends Component {

  render() {
    const { show, intl } = this.props;
    const { formatMessage } = intl;

    if (!show) return null;

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Warning color="orange" style={{ marginTop: -5 }} />
        <span style={{ color: '#bb271c', marginLeft: 2 }}>
          {formatMessage({ id: 'stop_has_expired_last_version' })}
        </span>
      </div>
    );
  }
}

export default injectIntl(HasExpiredInfo);
