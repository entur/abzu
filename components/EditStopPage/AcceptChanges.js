import React from 'react';
import MdWarning from 'material-ui/svg-icons/alert/warning';
import Checkbox from 'material-ui/Checkbox';
import { injectIntl } from 'react-intl';
import { enturPrimary } from '../config/enturTheme';

class AcceptChanges extends React.Component {

  render() {

    const { checked, onChange, intl} = this.props;
    const infoLabel = intl.formatMessage({id: 'accept_changes_info'})
    const checkboxLabel = intl.formatMessage({id: 'accept_changes'})

    return (
      <div style={{border: '1px solid', borderColor: checked ? enturPrimary : '#de3e35', padding: 10, marginTop: 10}}>
        <div
          style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}
        >
          <MdWarning color="orange" />
          <span style={{ fontWeight: 600, marginLeft: 5 }}>
                  {infoLabel}
                </span>
        </div>
        <Checkbox
          style={{marginLeft: 26, padding: 10, width: '80%'}}
          checked={checked}
          label={checkboxLabel}
          onCheck={onChange}
        />
      </div>
    )
  }
}

export default injectIntl(AcceptChanges);