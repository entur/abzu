import React from 'react';
import {
  ColumnTransformerStopPlaceJsx,
  ColumnTranslations,
} from '../models/columnTransformers';
import MakeExpandable from './MakeExpandable';
import ReportQuayRows from './ReportQuayRows';

class ReportResultView extends React.Component {
  render() {
    const { results, activePageIndex, stopPlaceColumnOptions, quaysColumnOptions, intl } = this.props;
    const { locale, formatMessage } = intl;

    const paginatedResults = getResultsPaginationMap(results);
    const resultItems = paginatedResults[activePageIndex] || [];

    const columnStyle = {
      flexBasis: '100%',
      textAlign: 'left',
      marginBottom: 5,
      marginTop: 5,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: 12
    };

    const columns = stopPlaceColumnOptions.filter(c => c.checked).map(c => c.id);
    const pageSize = results.length <= 20 ? results.length : 20;
    const showingResultLabel = formatMessage({ id: 'showing_results' })
      .replace('$size', pageSize)
      .replace('$total', results.length);

    return (
      <div style={{paddingBottom: 50}}>
        <div
          style={{
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
            lineHeight: '1.4',
          }}
        >
          <div
            style={{ display: 'flex', fontWeight: 600, paddingLeft: 10 }}
          >
            {columns.map( (column, i) =>
              <div key={'column-' + column} style={columnStyle}>
                {ColumnTranslations[locale][column]}
              </div>
            )}
            <div key={'column-expand'} style={columnStyle}></div>
          </div>

          {resultItems.map((item, index) => {
            const background = index % 2 ? 'rgba(213, 228, 236, 0.37)' : '#fff';

            return (
              <MakeExpandable
                expandedContent={
                  <ReportQuayRows
                    quays={item.quays}
                    columnOptions={quaysColumnOptions}
                  />
                }
                key={item.id}
                style={{
                  display: 'flex',
                  background: background,
                  padding: '0px 10px',
                }}
              >
                {columns.map(column =>
                  <div key={'column-item-' + column} style={columnStyle}>
                    {ColumnTransformerStopPlaceJsx[column](item)}
                  </div>,
                )}
              </MakeExpandable>
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
