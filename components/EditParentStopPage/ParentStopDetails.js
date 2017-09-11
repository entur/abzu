import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import MdWarning from 'material-ui/svg-icons/alert/warning';
import ImportedId from '../EditStopPage/ImportedId';
import { StopPlaceActions } from '../../actions/';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import StopPlaceList from './StopPlaceList';
import FlatButton from 'material-ui/FlatButton';
import CoordinatesDialog from '../Dialogs/CoordinatesDialog';
import AddStopPlaceToParent from '../Dialogs/AddStopPlaceToParent';
import { getAddStopPlaceInfo } from '../../graphql/Actions';
import { withApollo } from 'react-apollo';
import TagsDialog from '../EditStopPage/TagsDialog';

class ParentStopDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changePositionOpen: false,
      addStopPlaceOpen: false,
      tagsOpen: false
    };
  }

  handleChangeName(e, value) {
    this.props.dispatch(StopPlaceActions.changeStopName(value));
  }

  handleAddStopPlaceClose() {
    this.setState({
      addStopPlaceOpen: false
    });
  }

  handleAddStopPlaceOpen() {
    this.setState({
      addStopPlaceOpen: true
    });
  }

  handleAddStopPlace(checkedItems) {
    const { dispatch, stopPlace, client } = this.props;

    this.setState({
      addStopPlaceOpen: false
    });

    getAddStopPlaceInfo(client, checkedItems).then(result => {
      dispatch(StopPlaceActions.addChildrenToParenStopPlace(result));
    });
  }

  handleSubmitChangeCoordinates(position) {
    const { dispatch } = this.props;

    dispatch(StopPlaceActions.changeCurrentStopPosition(position));
    dispatch(StopPlaceActions.changeMapCenter(position, 14));

    this.setState({
      changePositionOpen: false
    });
  }

  handleChangeDescription(e, value) {
    this.props.dispatch(StopPlaceActions.changeStopDescription(value));
  }

  render() {
    const { stopPlace, intl } = this.props;
    const { changePositionOpen, addStopPlaceOpen } = this.state;
    const { formatMessage } = intl;

    return (
      <div style={{ padding: '10px 5px', minHeight: 600 }}>
        <div style={{ fontWeight: 600, fontSize: '1.1em', display: 'flex', justifyContent: 'space-between'}}>
          <div>{formatMessage({ id: 'parentStopPlace' })}</div>
          <FlatButton
            onClick={() => this.setState({ tagsOpen: true })}
            style={{ marginTop: -8 }}
            label={formatMessage({ id: 'tags' })}
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <FlatButton
            label={formatMessage({ id: 'set_centroid' })}
            labelStyle={{ fontSize: '0.7em' }}
            onClick={() => this.setState({ changePositionOpen: true })}
          />
        </div>
        <div style={{}}>
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
        <div style={{ width: '98%', margin: 'auto' }}>
          <TextField
            hintText={formatMessage({ id: 'name' })}
            floatingLabelText={formatMessage({ id: 'name' })}
            fullWidth={true}
            value={stopPlace.name}
            disabled={false}
            style={{ marginTop: -10 }}
            errorText={
              stopPlace.name ? '' : formatMessage({ id: 'name_is_required' })
            }
            onChange={this.handleChangeName.bind(this)}
          />
          <TextField
            hintText={formatMessage({ id: 'description' })}
            floatingLabelText={formatMessage({ id: 'description' })}
            fullWidth={true}
            disabled={false}
            value={stopPlace.description || ''}
            onChange={this.handleChangeDescription.bind(this)}
          />
          <Divider />
        </div>
        <StopPlaceList
          handleAddStopPlaceOpen={this.handleAddStopPlaceOpen.bind(this)}
          stopPlaces={stopPlace.children}
        />
        {addStopPlaceOpen &&
          <AddStopPlaceToParent
            open={addStopPlaceOpen}
            handleClose={this.handleAddStopPlaceClose.bind(this)}
            handleConfirm={this.handleAddStopPlace.bind(this)}
          />}
        <CoordinatesDialog
          intl={this.props.intl}
          open={changePositionOpen}
          coordinates={stopPlace.position}
          handleClose={() => this.setState({ changePositionOpen: false })}
          handleConfirm={this.handleSubmitChangeCoordinates.bind(this)}
        />
        <TagsDialog
          open={this.state.tagsOpen}
          tags={stopPlace.tags}
          intl={intl}
          handleClose={() => {
            this.setState({ tagsOpen: false });
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ stopPlace }) => ({
  stopPlace: stopPlace.current
});

export default withApollo(
  connect(mapStateToProps)(injectIntl(ParentStopDetails))
);
