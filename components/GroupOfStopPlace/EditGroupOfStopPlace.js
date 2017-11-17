import React, {Component} from 'react';
import MdBack from 'material-ui/svg-icons/navigation/arrow-back';
import GroupOfStopPlaceDetails from './GroupOfStopPlaceDetails';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import MdUndo from 'material-ui/svg-icons/content/undo';
import MdSave from 'material-ui/svg-icons/content/save';
import { connect } from 'react-redux';

class EditGroupOfStopPlace extends Component {

  render() {

    const style = {
      position: 'absolute',
      zIndex: 999,
      background: '#fff',
      border: '1px solid #000',
      marginTop: 1,
      marginLeft: 2,
    };

    const stopBoxBar = {
      color: '#fff',
      background: 'rgb(39, 58, 70)',
      fontSize: 12,
      padding: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    };

    const { formatMessage } = this.props.intl;

    return (
      <div style={style}>
        <div style={stopBoxBar}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
            <MdBack
              color="#fff"
              style={{
                cursor: 'pointer',
                marginRight: 2,
                transform: 'scale(0.8)'
              }}
              onClick={() => {}}
            />
            <div>Group of StopPlace</div>
          </div>
        </div>
        <div style={{fontSize: '1em', fontWeight: 600, padding: 5}}>
          Group of Stop Place
        </div>
        <GroupOfStopPlaceDetails/>
        <div
          style={{
            border: '1px solid #efeeef',
            textAlign: 'right',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around'
          }}
        >
          <FlatButton
            icon={<MdUndo style={{ height: '1.3em', width: '1.3em' }} />}
            disabled={!this.props.isModified}
            label={formatMessage({ id: 'undo_changes' })}
            style={{ margin: '8 5', zIndex: 999 }}
            labelStyle={{ fontSize: '0.7em' }}
            onClick={() => {
              this.setState({ confirmUndoOpen: true });
            }}
          />
          <FlatButton
            icon={<MdSave style={{ height: '1.3em', width: '1.3em' }} />}
            disabled={false}
            label={formatMessage({ id: 'save' })}
            style={{ margin: '8 5', zIndex: 999 }}
            labelStyle={{ fontSize: '0.7em' }}
            onClick={() => {}}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({stopPlacesGroup}) => ({
  isModified: stopPlacesGroup.isModified
})

export default connect(mapStateToProps)(injectIntl(EditGroupOfStopPlace));
