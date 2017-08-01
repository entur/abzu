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
    };
  }
  handleEditTimeEstimate(index, estimate) {
    if (estimate && !isNaN(estimate)) {
      this.props.dispatch(
        UserActions.editPolylineTimeEstimate(index, parseInt(estimate)),
      );
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

    if (!isEnabled) return null;

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
          <WalkingDistanceDialog
            open={openDialog}
            intl={intl}
            handleConfirm={this.handleEditTimeEstimate.bind(this)}
            handleClose={this.handleCloseDialog.bind(this)}
            estimate={polyline.estimate}
            index={index}
          />
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
                  onClick={() => this.setState({ openDialog: true })}
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
        {lines}
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
