import React, {Component} from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import MdWarning from 'material-ui/svg-icons/alert/warning';
import ImportedId from '../EditStopPage/ImportedId';
import { StopPlaceActions } from '../../actions/';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import StopPlaceList from './StopPlaceList';


class ParentStopDetails extends Component {

  handleChangeName(e, value) {
    this.props.dispatch(StopPlaceActions.changeStopName(value));
  }

  handleChangeDescription(e, value) {
    this.props.dispatch(StopPlaceActions.changeStopDescription(value));
  }

  render() {

    const { stopPlace, intl } = this.props;
    const { formatMessage } = intl;

    return (
      <div style={{padding: '10px 5px'}}>
        <div style={{fontWeight: 600, fontSize: '1.1em'}}>{formatMessage({id: 'parentStopPlace'})}</div>
        <div style={{  }}>
          {!stopPlace.isNewStop &&
          <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>
                  {formatMessage({ id: 'version' })} {stopPlace.version}
                </span>
            {stopPlace.hasExpired &&
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MdWarning
                color="orange"
                style={{ marginTop: -5, marginLeft: 10 }}
              />
              <span style={{ color: '#bb271c', marginLeft: 5 }}>
                      {formatMessage({ id: 'stop_has_expired' })}
                    </span>
            </div>}
          </div>}
          <ImportedId
            id={stopPlace.importedId}
            text={formatMessage({ id: 'local_reference' })}
          />
        </div>
        <div style={{width: '98%', margin: 'auto'}}>
          <TextField
            hintText={formatMessage({ id: 'name' })}
            floatingLabelText={formatMessage({ id: 'name' })}
            fullWidth={true}
            value={stopPlace.name}
            disabled={false}
            errorText={stopPlace.name ? '' : formatMessage({id: 'name_is_required'})}
            onChange={this.handleChangeName.bind(this)}
          />
          <TextField
            hintText={formatMessage({ id: 'description' })}
            floatingLabelText={formatMessage({ id: 'description' })}
            fullWidth={true}
            disabled={false}
            value={stopPlace.description || ''}
            style={{marginTop: -10}}
            onChange={this.handleChangeDescription.bind(this)}
          />
          <Divider/>
        </div>
        <StopPlaceList stopPlaces={stopPlace.children}/>
      </div>
    );
  }
}

const mapStateToProps = ({stopPlace}) => ({
  stopPlace: stopPlace.current
});

export default injectIntl(connect(mapStateToProps)(ParentStopDetails));
