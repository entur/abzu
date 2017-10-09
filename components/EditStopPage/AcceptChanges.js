/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */


import React from 'react';
import MdWarning from 'material-ui/svg-icons/alert/warning';
import Checkbox from 'material-ui/Checkbox';
import { injectIntl } from 'react-intl';
import { getPrimaryColor } from '../../config/themeConfig';

class AcceptChanges extends React.Component {

  render() {
    const { checked, onChange, intl } = this.props;
    const infoLabel = intl.formatMessage({ id: 'accept_changes_info' });
    const checkboxLabel = intl.formatMessage({ id: 'accept_changes' });
    const primary = getPrimaryColor();

    return (
      <div
        style={{
          border: '1px solid',
          borderColor: checked ? primary : '#de3e35',
          padding: 10,
          marginTop: 10
        }}
      >
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
          <MdWarning color="orange" />
          <span style={{ fontWeight: 600, marginLeft: 5 }}>
            {infoLabel}
          </span>
        </div>
        <Checkbox
          style={{ marginLeft: 26, padding: 10, width: '80%' }}
          checked={checked}
          label={checkboxLabel}
          onCheck={onChange}
        />
      </div>
    );
  }
}

export default injectIntl(AcceptChanges);
