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
import { Polyline, Popup, FeatureGroup } from 'react-leaflet';
import { connect } from 'react-redux';
import GenerateColor from '../../models/Colors';
import { UserActions } from '../../actions';
import { injectIntl } from 'react-intl';
import WalkingDistanceDialog from '../Dialogs/WalkingDistanceDialog';
import { getIn } from '../../utils';

class PathLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      index: -1,
      defaultEstimate: -0
    };
  }
  handleEditTimeEstimate(index, estimate) {
    if (estimate && !isNaN(estimate)) {
      this.props.dispatch(
        UserActions.editPolylineTimeEstimate(index, parseInt(estimate)),
      );

      this.setState({
        defaultEstimate: estimate,
        index: index
      });
    }

    this.handleCloseDialog();
  }

  handleCloseDialog() {
    this.setState({
      openDialog: false,
    });
  }

  render() {
    const { pathLink, intl, isEnabled } = this.props;
    const { openDialog } = this.state;
    const { formatMessage } = intl;

    if (!isEnabled || (!pathLink || !pathLink.length)) return null;

    const polylinePopupStyle = {
      cursor: 'pointer',
      width: '100%',
      display: 'inline-block',
      marginTop: 10,
      textAlign: 'center',
      textDecoration: 'underline',
      fontWeight: 600,
    };

    let lines = pathLink.map((polyline, index) => {
      let color = GenerateColor(index);

      let isCompleted = polyline.to;

      let position = arrayOfPolylinesFromPolyline(polyline);

      return (
        <Polyline
          weight={8}
          key={'pl' + index}
          color={color}
          positions={position}
          opacity={isCompleted ? 1 : 0.8}
          dashArray="8,2"
        >
          <Popup key={'pl' + index}>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  width: '100%',
                  textAlign: 'center',
                  margin: 0,
                  color: color,
                  display: 'inline-block',
                }}
              >
                {formatMessage({ id: 'pathLink' })} {index + 1}
              </div>
              <div>
                {polyline.distance
                  ? <span
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        marginTop: 10,
                        fontWeight: 600,
                        display: 'inline-block',
                      }}
                    >
                     {parseFloat(polyline.distance.toFixed(2))} m
                    </span>
                  : null}
                <span
                  style={polylinePopupStyle}
                  onClick={() => this.setState({ openDialog: true, defaultEstimate: polyline.estimate, index: index })}
                >
                  {polyline.estimate}{' '}
                  {Number(polyline.estimate) === 1
                    ? formatMessage({ id: 'second' })
                    : formatMessage({ id: 'seconds' })}
                </span>
              </div>
            </div>
          </Popup>
        </Polyline>
      );
    });

    return (
      <FeatureGroup>
        <div>
          <WalkingDistanceDialog
            open={openDialog}
            intl={intl}
            handleConfirm={this.handleEditTimeEstimate.bind(this)}
            handleClose={this.handleCloseDialog.bind(this)}
            estimate={this.state.defaultEstimate}
            index={this.state.index}
          />
          {lines}
        </div>
      </FeatureGroup>
    );
  }
}

const arrayOfPolylinesFromPolyline = line => {
  let arrayOfPolylines = [];

  let startPosition = getIn(line, [
    'from',
    'placeRef',
    'addressablePlace',
    'geometry',
    'coordinates',
  ]);
  let endPosition = getIn(line, [
    'to',
    'placeRef',
    'addressablePlace',
    'geometry',
    'coordinates',
  ]);

  if (startPosition) {
    arrayOfPolylines.push(startPosition[0]);
  }

  if (line.inBetween) {
    arrayOfPolylines.push.apply(arrayOfPolylines, line.inBetween);
  }

  if (endPosition) {
    arrayOfPolylines.push(endPosition[0]);
  }

  return arrayOfPolylines;
};

const mapStateToProps = state => ({
  pathLink: state.stopPlace.pathLink || [],
  isEnabled: state.stopPlace.enablePolylines,
});

export default injectIntl(connect(mapStateToProps)(PathLink));
