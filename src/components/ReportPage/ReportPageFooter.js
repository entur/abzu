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

import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import { jsonArrayToCSV } from "../../utils/CSVHelper";
import {
  ColumnTransformersStopPlace,
  ColumnTransformersQuays,
} from "../../models/columnTransformers";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import moment from "moment";
import { getDarkColor } from "../../config/themeConfig";
import { Popover } from "@mui/material";

class ReportPageFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleExportOpen(event) {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  downloadCSV(items, columns, filename, transformer) {
    let csv = jsonArrayToCSV(items, columns, ";", transformer);
    const BOM = "\uFEFF";
    const content = BOM + csv;
    let element = document.createElement("a");
    let blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    let dateNow = moment(new Date()).format("DD-MM-YYYY");
    let fullFilename = filename + "-" + dateNow + ".csv";
    let url = URL.createObjectURL(blob);
    element.href = url;
    element.setAttribute("target", "_blank");
    element.setAttribute("download", fullFilename);

    let event = document.createEvent("MouseEvents");
    event.initMouseEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );

    element.dispatchEvent(event);
  }

  handleGetCSVStopPlace() {
    const { results, stopPlaceColumnOptions } = this.props;
    this.downloadCSV(
      results,
      stopPlaceColumnOptions,
      "results-stop-places",
      ColumnTransformersStopPlace
    );
    this.setState({
      open: false,
    });
  }

  handleGetCSVQuays() {
    const { results, quaysColumnOptions } = this.props;
    let items = [];
    let finalColumns = quaysColumnOptions.slice();
    let prependedColumns = ["stopPlaceId", "stopPlaceName"];

    prependedColumns.forEach((pc) => {
      finalColumns.unshift({
        id: pc,
        checked: true,
      });
    });

    results.forEach((result) => {
      const quays = result.quays.map((quay) => ({
        ...quay,
        stopPlaceId: result.id,
        stopPlaceName: result.name,
      }));
      items = items.concat.apply(items, quays);
    });

    this.downloadCSV(
      items,
      finalColumns,
      "results-quays",
      ColumnTransformersQuays
    );
    this.setState({
      open: false,
    });
  }

  render() {
    const { results, activePageIndex, handleSelectPage, intl } = this.props;
    const { formatMessage } = intl;

    const totalCount = results.length;

    const style = {
      width: "100%",
      display: "flex",
      bottom: 0,
      padding: "10px 0px",
      background: getDarkColor(),
      justifyContent: "space-between",
      position: "fixed",
      height: 35,
      zIndex: 100,
    };

    const pageWrapperStyle = {
      color: "#fff",
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      padding: 10,
    };

    const pageItemStyle = {
      fontSize: 14,
      cursor: "pointer",
      paddingLeft: 5,
      paddingRight: 5,
    };

    const activePageStyle = {
      fontWeight: 600,
      borderBottom: "1px solid #41c0c4",
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
            {formatMessage({ id: "page" })}:
          </div>
          {pages.map((page) => (
            <div
              onClick={() => handleSelectPage(page)}
              style={
                activePageIndex === page
                  ? { ...pageItemStyle, ...activePageStyle }
                  : pageItemStyle
              }
              key={"page-" + page}
            >
              {page + 1}
            </div>
          ))}
        </div>
        <div style={{ marginRight: 20, display: "flex" }}>
          <RaisedButton
            onClick={this.handleExportOpen.bind(this)}
            label={formatMessage({ id: "export_to_csv" })}
            disabled={!totalCount}
            primary={true}
          />
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            targetOrigin={{ horizontal: "left", vertical: "top" }}
            onClose={() => {
              this.setState({ open: false });
            }}
          >
            <Menu>
              <MenuItem
                onClick={this.handleGetCSVStopPlace.bind(this)}
                primaryText={formatMessage({ id: "export_to_csv_stop_places" })}
              />
              <MenuItem
                onClick={this.handleGetCSVQuays.bind(this)}
                primaryText={formatMessage({ id: "export_to_csv_quays" })}
              />
            </Menu>
          </Popover>
        </div>
      </div>
    );
  }
}

export default ReportPageFooter;
