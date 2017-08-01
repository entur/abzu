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

    const { columnOptions, intl, quays } = this.props;
    const { locale } = intl;

    const columns = columnOptions.filter(c => c.checked).map(c => c.id);

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
                {ColumnTransformerQuaysJsx[column](quay)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(ReportQuayRows);
