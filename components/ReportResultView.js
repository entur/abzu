import React from 'react';
import {
  ColumnTransformersJSX,
  ColumnTranslations,
} from '../models/columnTransformers';

class ReportResultView extends React.Component {
  render() {
    const { results, activePageIndex, columnOptions, intl } = this.props;
    const { locale, formatMessage } = intl;

    const paginatedResults = getResultsPaginationMap(results);
    const resultItems = paginatedResults[activePageIndex] || [];

    const columnStyle = {
      flexBasis: '100%',
      textAlign: 'left',
      marginLeft: 5,
      marginBottom: 5,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

    const columnStyleHeader = {
      ...columnStyle,
      marginLeft: 0,
    };

    const columns = columnOptions.filter(c => c.checked).map(c => c.id);
    const pageSize = results.length <= 20 ? results.length : 20;
    const showingResultLabel = formatMessage({ id: 'showing_results' })
      .replace('$size', pageSize)
      .replace('$total', results.length);

    return (
      <div style={{paddingBottom: 50}}>
        <div
          style={{
            marginLeft: 5,
            fontWeight: 600,
            fontSize: 12,
            textAlign: 'center',
            marginBottom: 10,
            marginTop: -15,
          }}
        >
          {showingResultLabel}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            lineHeight: '1.5',
          }}
        >
          <div
            key={'column-header'}
            style={{ display: 'flex', fontWeight: 600, paddingLeft: 10 }}
          >
            {columns.map(column =>
              <div key={'column-' + column} style={columnStyleHeader}>
                {ColumnTranslations[locale][column]}
              </div>,
            )}
          </div>

          {resultItems.map((item, index) => {
            const background = index % 2 ? 'rgba(213, 228, 236, 0.37)' : '#fff';

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  background: background,
                  padding: '0px 10px',
                }}
              >
                {columns.map(column =>
                  <div key={'column-item-' + column} style={columnStyle}>
                    {ColumnTransformersJSX[column](item)}
                  </div>,
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getResultsPaginationMap = results => {
  if (!results || !results.length) return [];

  let paginationMap = [];
  for (let i = 0, j = results.length; i < j; i += 20) {
    paginationMap.push(results.slice(i, i + 20));
  }
  return paginationMap;
};

export default ReportResultView;
