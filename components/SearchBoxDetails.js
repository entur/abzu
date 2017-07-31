import React from 'react';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import FlatButton from 'material-ui/FlatButton';
import ModalityIcon from '../components/ModalityIcon';
import { FormattedMessage } from 'react-intl';
import Warning from 'material-ui/svg-icons/alert/warning';
import MapsMyLocation from 'material-ui/svg-icons/maps/my-location';
import CircularNumber from '../components/CircularNumber';
import WheelChair from 'material-ui/svg-icons/action/accessible';
import { getIn } from '../utils/';

const SearchBoxDetails = ({
  text,
  result,
  handleEdit,
  handleChangeCoordinates,
  userSuppliedCoordinates,
  canEdit,
  formatMessage
}) => {
  const style = {
    background: '#fefefe',
    border: '1px dotted #add8e6',
    padding: 5
  };

  const hasWheelchairAccess =
    getIn(
      result,
      ['accessibilityAssessment', 'limitations', 'wheelchairAccess'],
      null
    ) === 'TRUE';

  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 0
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 600 }}>{result.name}</div>
        <ModalityIcon
          submode={result.submode}
          type={result.stopPlaceType}
        />
      </div>
      {result.hasExpired &&
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Warning color="orange" style={{ marginTop: -5 }} />
          <span style={{ color: '#bb271c', marginLeft: 2 }}>
           { formatMessage({ id: 'stop_has_expired_last_version' }) }
          </span>
        </div>}
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{fontSize: 18}}>{ `${result.topographicPlace || '?' }, ${result.parentTopographicPlace || '?' }` }</div>
        <div style={{fontSize: 14}}>{result.id}</div>
      </div>
        <div style={{ display: 'block', fontSize: 10 }}>
        <span style={{ fontWeight: 600 }}>
          {formatMessage({ id: 'local_reference' })}
        </span>
        {result.importedId ? result.importedId.join(', ') : ''}
      </div>
      <div style={{ display: 'flex', justifyItems: 'center', padding: 10 }}>
        <div style={{ fontSize: 16, textTransform: 'capitalize' }}>
          {formatMessage({ id: 'quays' })}
        </div>
        <div style={{ marginLeft: 5 }}>
          <CircularNumber number={result.quays.length} color="#0097a7" />
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', fontSize: 10, maxHeight: 120, overflow: 'scroll', width: '95%', margin: '0px auto 20px auto'}}>
        { result.quays.map( (quay, i) => (
          <div key={'q-importedID' + quay.id} style={{borderBottom: '1px solid #0078a8', background: i % 2 ? '#f8f8f8' : '#fff', padding: 2}}>
            <div style={{fontWeight: 600 }}>{formatMessage({ id: 'local_reference' }).replace(':','')} {` (${quay.id}):`}</div>
            {quay.importedId ? quay.importedId.join(', ') : ''}
          </div>
        ))}
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
      {!userSuppliedCoordinates && result.isMissingLocation
        ? <div className="warning_message" style={{marginTop: 10}}>
            <Warning
              style={{ verticalAlign: 'sub', fill: 'rgb(214, 134, 4)' }}
            />
            <FormattedMessage
              className="message_warning"
              id="is_missing_coordinates"
            />
            <div style={{ marginTop: 2, marginBottom: 10 }}>
              <span
                style={{
                  borderBottom: '1px dotted',
                  color: 'rgb(0, 188, 212)',
                  fontWeight: 600,
                  marginBottom: 10,
                  fontSize: '0.8em',
                  cursor: 'pointer'
                }}
                onClick={() => handleChangeCoordinates()}
              >
                <FormattedMessage
                  className="message_warning_helper_text"
                  id="is_missing_coordinates_help_text"
                />
              </span>
            </div>
          </div>
        : null}
      {userSuppliedCoordinates && result.isMissingLocation
        ? <div style={{ marginTop: 10 }}>
            <FormattedMessage
              className="message_warning"
              id="you_are_using_temporary_coordinates"
            />
            <div style={{ marginTop: 5, marginBottom: 10 }}>
              <span
                style={{
                  borderBottom: '1px dotted',
                  color: 'rgb(0, 188, 212)',
                  fontWeight: 600,
                  marginBottom: 10,
                  fontSize: '0.8em',
                  cursor: 'pointer'
                }}
                onClick={() => handleChangeCoordinates()}
              >
                <FormattedMessage
                  className="message_warning_helper_text"
                  id="change_coordinates"
                />
              </span>
            </div>
          </div>
        : null}
      <div style={{ width: '100%', textAlign: 'right' }}>
        <FlatButton
          onClick={() => handleEdit(result.id)}
          style={{ marginTop: 10 }}
        >
          {canEdit
            ? <Edit
                style={{ width: 16, verticalAlign: 'middle', height: 16 }}
              />
            : <MapsMyLocation
                style={{ width: 16, verticalAlign: 'middle', height: 16 }}
              />}
          <span style={{ fontSize: '.8em', marginLeft: 5 }}>
            {canEdit ? text.edit : text.view}
          </span>
        </FlatButton>
      </div>
    </div>
  );
};

export default SearchBoxDetails;
