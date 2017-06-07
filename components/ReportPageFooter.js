import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { jsonArrayToCSV } from '../utils/CSVHelper';
import {
  ColumnTransformersStopPlace,
  ColumnTransformersQuays
} from '../models/columnTransformers';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

class ReportPageFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleExportOpen(event) {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  // TODO : This only works correctly in Chrome, fix for FF and Safari needed
  downloadCSV(items, columns, filename, transformer) {
    let csv = jsonArrayToCSV(items, columns, ';', transformer);
    var element = document.createElement('a');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    element.href = url;
    element.setAttribute('download', filename);
    element.click();
  }

  handleGetCSVStopPlace() {
    const { results, stopPlaceColumnOptions } = this.props;
    this.downloadCSV(
      results,
      stopPlaceColumnOptions,
      'results-stop-places',
      ColumnTransformersStopPlace
    );
    this.setState({
      open: false
    });
  }

  handleGetCSVQuays() {
    const { results, quaysColumnOptions } = this.props;
    let items = [];
    const columnOptions = quaysColumnOptions.concat({
      id: 'stopPlaceId',
      checked: true
    });

    results.forEach(result => {
      const quays = result.quays.map(quay => ({
        ...quay,
        stopPlaceId: result.id
      }));
      items = items.concat.apply(items, quays);
    });

    this.downloadCSV(
      items,
      columnOptions,
      'results-quays',
      ColumnTransformersQuays
    );
    this.setState({
      open: false
    });
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
      zIndex: 100
    };

    const pageWrapperStyle = {
      color: '#fff',
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      padding: 10
    };

    const pageItemStyle = {
      fontSize: 14,
      cursor: 'pointer',
      paddingLeft: 5,
      paddingRight: 5
    };

    const activePageStyle = {
      fontWeight: 600,
      borderBottom: '1px solid #41c0c4'
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
            </div>
          )}
        </div>
        <div style={{ marginRight: 20, display: 'flex' }}>
          <RaisedButton
            onTouchTap={this.handleExportOpen.bind(this)}
            label={formatMessage({ id: 'export_to_csv' })}
            disabled={!totalCount}
            primary={true}
          />
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={() => {
              this.setState({ open: false });
            }}
          >
            <Menu>
              <MenuItem
                onClick={this.handleGetCSVStopPlace.bind(this)}
                primaryText={formatMessage({ id: 'export_to_csv_stop_places' })}
              />
              <MenuItem
                onClick={this.handleGetCSVQuays.bind(this)}
                primaryText={formatMessage({ id: 'export_to_csv_quays' })}
              />
            </Menu>
          </Popover>
        </div>
      </div>
    );
  }
}

export default ReportPageFooter;
