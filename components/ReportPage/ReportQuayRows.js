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
import { injectIntl } from 'react-intl';
import {
  ColumnTransformerQuaysJsx,
  ColumnTranslations
} from '../../models/columnTransformers';

class ReportQuayRows extends React.Component {

  render() {
    const columnStyle = {
      flexBasis: '100%',
      textAlign: 'left',
      marginBottom: 5,
      marginTop: 5,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: 12
    };

    const { columnOptions, intl, quays, duplicateInfo } = this.props;
    const { locale } = intl;

    const columns = columnOptions.filter(c => c.checked).map(c => c.id);

    if (!quays.length) return null;

    return (
      <div>
        <div style={{ display: 'flex', fontWeight: 600, paddingLeft: 10 }}>
          {columns.map((column, i) =>
            <div key={'quay-column-' + i} style={columnStyle}>
              {ColumnTranslations[locale][column]}
            </div>
          )}
        </div>
        {quays.map(quay =>
          <div
            key={'key-' + quay.id}
            style={{
              display: 'flex',
              padding: '0px 10px',
              border: '1px dotted grey'
            }}
          >
            {columns.map(column =>
              <div key={'column-quay-item-' + column} style={columnStyle}>
                {ColumnTransformerQuaysJsx[column](quay, duplicateInfo)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(ReportQuayRows);
