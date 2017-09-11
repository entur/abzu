import React, { Component } from 'react';
import { getIn } from '../../utils/';
import HasExpiredInfo from './HasExpiredInfo';
import CircularNumber from './CircularNumber';
import WheelChair from 'material-ui/svg-icons/action/accessible';
import ModalityTray from '../ReportPage/ModalityIconTray';
import TagTray from './TagTray';


class ParentStopPlaceResultInfo extends Component {
  render() {
    const { result, formatMessage } = this.props;

    const hasWheelchairAccess =
      getIn(
        result,
        ['accessibilityAssessment', 'limitations', 'wheelchairAccess'],
        null
      ) === 'TRUE';

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 0
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 600 }}>{result.name}</div>
          <div>
            <ModalityTray
              modalities={result.children.map(child => ({
                submode: child.submode,
                stopPlaceType: child.stopPlaceType
              }))}
            />
          </div>
        </div>
        <HasExpiredInfo show={result.hasExpired} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {result.topographicPlace &&
            result.parentTopographicPlace &&
            <div
              style={{ fontSize: 18 }}
            >{`${result.topographicPlace}, ${result.parentTopographicPlace}`}</div>}
          <div style={{ fontSize: 14 }}>{result.id}</div>
        </div>
        <div style={{ display: 'block', fontSize: 10 }}>
          <span style={{ fontWeight: 600 }}>
            {formatMessage({ id: 'local_reference' })}
          </span>
          {result.importedId ? result.importedId.join(', ') : ''}
        </div>
        <TagTray tags={result.tags}/>
        <div style={{ display: 'flex', justifyItems: 'center', padding: 10 }}>
          <div style={{ fontSize: 16, textTransform: 'capitalize' }}>
            {formatMessage({ id: 'stop_places' })}
          </div>
          <div style={{ marginLeft: 5 }}>
            <CircularNumber number={result.children.length} color="#0097a7" />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 10,
            maxHeight: 120,
            overflow: 'auto',
            width: '95%',
            margin: '0px auto 20px auto'
          }}
        >
          {result.children.map((quay, i) =>
            <div
              key={'q-importedID' + quay.id}
              style={{
                borderBottom: '1px solid #0078a8',
                background: i % 2 ? '#f8f8f8' : '#fff',
                padding: 2
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {formatMessage({ id: 'local_reference' }).replace(':', '')}
                {' '}{` (${quay.id}):`}
              </div>
              {quay.importedId ? quay.importedId.join(', ') : ''}
            </div>
          )}
        </div>
        {hasWheelchairAccess
          ? <div
              style={{
                display: 'flex',
                marginLeft: 5,
                alignItems: 'center',
                fontSize: 12
              }}
            >
              <WheelChair color="#0097a7" />
              <span style={{ marginLeft: 5 }}>
                {formatMessage({ id: 'wheelchairAccess' })}
              </span>
            </div>
          : null}
      </div>
    );
  }
}

export default ParentStopPlaceResultInfo;
