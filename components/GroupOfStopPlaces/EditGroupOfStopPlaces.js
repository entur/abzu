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
import GroupOfStopPlaceDetails from './GroupOfStopPlacesDetails';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import MdUndo from 'material-ui/svg-icons/content/undo';
import MdSave from 'material-ui/svg-icons/content/save';
import { connect } from 'react-redux';
import SaveGroupDialog from '../Dialogs/SaveGroupDialog';
import mapHelper from '../../modelUtils/mapToQueryVariables';
import { mutateGroupOfStopPlace, deleteGroupOfStopPlaces } from '../../graphql/Tiamat/actions';
import { withApollo } from 'react-apollo';
import * as types from '../../actions/Types';
import Routes from '../../routes/';
import { UserActions, StopPlacesGroupActions } from '../../actions/';
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import { getIn } from '../../utils/';


class EditGroupOfStopPlaces extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmSaveDialogOpen: false,
      confirmGoBack: false,
      confirmUndo: false,
      confirmDeleteDialogOpen: false,
    };
  }

  handleAllowUserToGoBack() {
    if (this.props.isModified) {
      this.setState({
        confirmGoBack: true
      });
    } else {
      this.handleGoBack();
    }
  }

  handleDiscardChanges() {
    this.setState({
      confirmUndoOpen: false
    });
    this.props.dispatch(StopPlacesGroupActions.discardChanges());
  }

  handleGoBack() {
    this.setState({
      confirmGoBack: false
    });
    this.props.dispatch(UserActions.navigateTo('/', ''));
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

  handleDeleteGroup() {
    const { client, dispatch, groupOfStopPlaces } = this.props;
    deleteGroupOfStopPlaces(client, groupOfStopPlaces.id)
    .then(response => {
      dispatch(UserActions.navigateTo('/', ''));
    });
  }

  getHeaderText(groupOfStopPlaces, formatMessage) {
    if (groupOfStopPlaces.id) {
      return `${groupOfStopPlaces.name} (${groupOfStopPlaces.id})`
    }
    return formatMessage({id: 'you_are_creating_group'})
  }

  handleSave() {
    const { groupOfStopPlaces, client } = this.props;
    const variables = mapHelper.mapGroupOfStopPlaceToVariables(groupOfStopPlaces);
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
    const { originalGOS, groupOfStopPlaces, canEdit, canDelete } = this.props;

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
              onClick={() => this.handleAllowUserToGoBack()}
            />
            <div>{this.getHeaderText(originalGOS, formatMessage)}</div>
          </div>
        </div>
        <div style={{fontSize: '1em', fontWeight: 600, padding: 5}}>
          {formatMessage({id: 'group_of_stop_places'})}
        </div>
        <GroupOfStopPlaceDetails formatMessage={formatMessage} canEdit={canEdit}/>
        <div
          style={{
            border: '1px solid #efeeef',
            textAlign: 'right',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around'
          }}
        >
          { groupOfStopPlaces.id && (
              <FlatButton
                label={formatMessage({ id: 'remove' })}
                style={{ margin: '8 5', zIndex: 999 }}
                disabled={!canDelete}
                labelStyle={{ fontSize: '0.7em' }}
                onClick={() => { this.setState({confirmDeleteDialogOpen: true})}}
              />
            )
          }
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
            disabled={!this.props.isModified || !groupOfStopPlaces.name || !canEdit}
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
        <ConfirmDialog
          open={this.state.confirmGoBack}
          handleClose={() => {
            this.setState({
              confirmGoBack: false
            });
          }}
          handleConfirm={() => {
            this.handleGoBack();
          }}
          messagesById={{
            title: 'discard_changes_title',
            body: 'discard_changes_group_body',
            confirm: 'discard_changes_confirm',
            cancel: 'discard_changes_cancel'
          }}
          intl={this.props.intl}
        />
        <ConfirmDialog
          open={this.state.confirmUndoOpen}
          handleClose={() => {
            this.setState({
              confirmUndoOpen: false
            });
          }}
          handleConfirm={() => {
            this.handleDiscardChanges();
          }}
          messagesById={{
            title: 'discard_changes_title',
            body: 'discard_changes_group_body',
            confirm: 'discard_changes_confirm',
            cancel: 'discard_changes_cancel'
          }}
          intl={this.props.intl}
        />
        <ConfirmDialog
          open={this.state.confirmDeleteDialogOpen}
          handleClose={() => {
            this.setState({
              confirmDeleteDialogOpen: false
            });
          }}
          handleConfirm={() => {
            this.handleDeleteGroup();
          }}
          messagesById={{
            title: 'delete_group_title',
            body: 'delete_group_body',
            confirm: 'delete_group_confirm',
            cancel: 'delete_group_cancel'
          }}
          intl={this.props.intl}
        />
      </div>
    );
  }
}

const mapStateToProps = ({stopPlacesGroup, roles}) => ({
  isModified: stopPlacesGroup.isModified,
  groupOfStopPlaces: stopPlacesGroup.current,
  originalGOS: stopPlacesGroup.original,
  canEdit: getIn(roles, ['allowanceInfo', 'canEdit'], false),
  canDelete: getIn(roles, ['allowanceInfo', 'canDelete'], false)
});

export default withApollo(connect(mapStateToProps)(injectIntl(EditGroupOfStopPlaces)));
