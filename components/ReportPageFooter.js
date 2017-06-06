import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { jsonArrayToCSV } from '../utils/CSVHelper';

class ReportPageFooter extends React.Component {
  // TODO : This only works correctly in Chrome, fix for FF and Safari needed
  handleGetCSV() {
    const { results, columnOptions } = this.props;
    let csv = jsonArrayToCSV(results, columnOptions);
    var element = document.createElement('a');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    element.href = url;
    element.setAttribute('download', 'results.csv');
    element.click();
  }

  render() {
    const { results, activePageIndex, handleSelectPage, intl } = this.props;
    const { formatMessage } = intl;

    const totalCount = results.length;

    const style = {
      width: '100%',
      display: 'flex',
      bottom: 0,
      padding: '10px 0px',
      background: '#213a46',
      justifyContent: 'space-between',
      position: 'fixed',
      height: 35,
  };

    const pageWrapperStyle = {
      color: '#fff',
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      padding: 10,
    };

    const pageItemStyle = {
      fontSize: 14,
      cursor: 'pointer',
      paddingLeft: 5,
      paddingRight: 5,
    };

    const activePageStyle = {
      fontWeight: 600,
      borderBottom: '1px solid #41c0c4',
    };

    let pages = [];

    if (totalCount) {
      for (let i = 0; i < Math.ceil(totalCount / 20); i++) {
        pages.push(i);
      }
    }

    return (
      <div style={style}>
        <div style={pageWrapperStyle}>
          <div style={{ marginRight: 10 }}>
            {formatMessage({ id: 'page' })}:
          </div>
          {pages.map(page =>
            <div
              onClick={() => handleSelectPage(page)}
              style={
                activePageIndex === page
                  ? { ...pageItemStyle, ...activePageStyle }
                  : pageItemStyle
              }
              key={'page-' + page}
            >
              {page + 1}
            </div>,
          )}
        </div>
        <div style={{ marginRight: 20 }}>
          <RaisedButton
            disabled={!totalCount}
            onClick={this.handleGetCSV.bind(this)}
            primary={true}
            label={formatMessage({ id: 'export_to_csv' })}
          />
        </div>
      </div>
    );
  }
}

export default ReportPageFooter;
