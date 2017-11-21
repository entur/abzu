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

import React, {Component} from 'react';
import MdBack from 'material-ui/svg-icons/navigation/arrow-back';
import GroupOfStopPlaceDetails from './GroupOfStopPlaceDetails';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import MdUndo from 'material-ui/svg-icons/content/undo';
import MdSave from 'material-ui/svg-icons/content/save';
import { connect } from 'react-redux';
import SaveGroupDialog from '../Dialogs/SaveGroupDialog';
import mapHelper from '../../modelUtils/mapToQueryVariables';
import { mutateGroupOfStopPlace } from '../../graphql/Actions';
import { withApollo } from 'react-apollo';
import * as types from '../../actions/Types';
import Routes from '../../routes/';
import { UserActions } from '../../actions/';

class EditGroupOfStopPlace extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmSaveDialogOpen: false
    };
  }

  handleSaveSuccess(groupId) {
    const { dispatch } = this.props;

    this.setState({
      confirmSaveDialogOpen: false
    });

    if (groupId) {
      dispatch(UserActions.navigateTo(`/${Routes.GROUP_OF_STOP_PLACE}/`, groupId));
      dispatch(UserActions.openSnackbar(types.SUCCESS));
    }
  }

  handleSave() {
    const { groupOfStopPlace, client } = this.props;
    const variables = mapHelper.mapGroupOfStopPlaceToVariables(groupOfStopPlace);
    mutateGroupOfStopPlace(client, variables).then(groupId => {
      this.handleSaveSuccess(groupId);
    });
  }

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
            disabled={!this.props.isModified}
            label={formatMessage({ id: 'save' })}
            style={{ margin: '8 5', zIndex: 999 }}
            labelStyle={{ fontSize: '0.7em' }}
            onClick={() => { this.setState({confirmSaveDialogOpen: true})}}
          />
        </div>
        <SaveGroupDialog
          handleSave={this.handleSave.bind(this)}
          open={this.state.confirmSaveDialogOpen}
          handleClose={() => {
            this.setState({confirmSaveDialogOpen: false})
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({stopPlacesGroup}) => ({
  isModified: stopPlacesGroup.isModified,
  groupOfStopPlace: stopPlacesGroup.current,
})

export default withApollo(connect(mapStateToProps)(injectIntl(EditGroupOfStopPlace)));
