import React from 'react';
import { connect } from 'react-redux';
import MdClose from 'material-ui/svg-icons/navigation/close';
import MdEdit from 'material-ui/svg-icons/editor/mode-edit';
import MdRemove from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import { enturPrimary } from '../config/enturTheme';
import EditKeyValuePair from './EditKeyValuePair';
import CreateKeyValuePair from './CreateKeyValuePair';
import { StopPlaceActions, UserActions } from '../actions/';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { selectKeyValuesDataSource } from '../reducers/selectors';

class KeyValuesDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditingOpen: false,
      isCreatingOpen: false,
      editingKey: null
    };
  }

  handleEditValuesForKey(key) {
    this.setState({
      isEditingOpen: true,
      isCreatingOpen: false,
      editingKey: key
    });
  }

  handleDeleteKey(key) {
    this.props.dispatch(StopPlaceActions.deleteKeyValuesByKey(key));
  }

  handleUpdateValues(key, values) {
    this.setState({
      isEditingOpen: false
    });
    this.props.dispatch(StopPlaceActions.updateKeyValuesForKey(key, values));
  }

  handleCreateValues(key, values) {
    this.setState({
      isCreatingOpen: false
    });
    this.props.dispatch(StopPlaceActions.createKeyValuesPair(key, values));
  }

  handleOpenCreateValues() {
    this.setState({
      isEditingOpen: false,
      isCreatingOpen: true
    });
  }

  handleClose() {
    this.props.dispatch(UserActions.closeKeyValuesDialog());
  }

  render() {
    const { open, intl, keyValues, disabled } = this.props;
    const { formatMessage } = intl;

    const translations = {
      value: formatMessage({ id: 'name' }),
      tariffZones: formatMessage({ id: 'key_values_hint' }),
      noTariffZones: formatMessage({ id: 'key_values_no' })
    };

    if (!open) return null;

    const style = {
      position: 'fixed',
      left: 400,
      top: 105,
      background: '#fff',
      border: '1px solid black',
      width: 350,
      zIndex: 999
    };

    const itemStyle = {
      flexBasis: '100%',
      textAlign: 'left',
      flex: 2
    };

    return (
      <div style={style}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 5
          }}
        >
          <div
            style={{
              marginTop: 8,
              fontWeight: 60,
              marginLeft: 10,
              fontWeight: 600
            }}
          >
            {translations.tariffZones}
          </div>
          <IconButton
            style={{ marginRight: 5 }}
            onTouchTap={() => {
              this.handleClose();
            }}
          >
            <MdClose />
          </IconButton>
        </div>
        <div
          style={{
            width: '100%',
            fontSize: 14,
            maxHeight: 300,
            overflowY: 'scroll',
            marginLeft: 15,
            marginBottom: 5
          }}
        >
          {!keyValues.length
            ? <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginBottom: 10,
                  fontSize: 12
                }}
              >
                {translations.noTariffZones}
              </div>
            : <div
                style={{
                  width: '100%',
                  fontSize: 12,
                  overflowY: 'overlay',
                  maxHeight: 400,
                  marginLeft: 5
                }}
              >
                {keyValues.map((kvp, i) =>
                  <div
                    key={'key-value-' + i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      lineHeight: 1.2
                    }}
                  >
                    <div style={{ ...itemStyle, fontWeight: 600, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexBasis: '100%' }}>
                        <span>{kvp.key}</span>
                        {!disabled &&
                        <div>
                          <MdEdit
                            style={{
                              height: 14,
                              width: 14,
                              color: enturPrimary,
                              marginTop: -2,
                              marginLeft: 5,
                              cursor: 'pointer'
                            }}
                            onClick={() => this.handleEditValuesForKey(kvp.key)}
                          />
                          <MdRemove
                            style={{
                              height: 14,
                              width: 14,
                              color: '#df544a',
                              marginTop: -2,
                              marginLeft: 5,
                              cursor: 'pointer'
                            }}
                            onClick={() => this.handleDeleteKey(kvp.key)}
                          />
                        </div>
                        }
                      </div>
                    </div>
                    <div style={itemStyle}>
                      {kvp.values.map((v, i) => <p key={'value-' + i}>{v}</p>)}
                    </div>
                  </div>
                )}
              </div>}
        </div>
        {!disabled &&
          <FloatingActionButton
            onClick={this.handleOpenCreateValues.bind(this)}
            mini={true}
            style={{ marginLeft: 20, marginBottom: 10 }}
          >
            <ContentAdd />
          </FloatingActionButton>}
        <EditKeyValuePair
          isOpen={this.state.isEditingOpen}
          editingKey={this.state.editingKey}
          keyValues={keyValues}
          handleUpdateValues={this.handleUpdateValues.bind(this)}
        />
        <CreateKeyValuePair
          isOpen={this.state.isCreatingOpen}
          keyValues={keyValues}
          handleCreateValues={this.handleCreateValues.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  open: state.user.keyValuesDialogOpen,
  keyValues: selectKeyValuesDataSource(
    state.user.keyValuesOrigin,
    state.stopPlace.current
  )
});

export default connect(mapStateToProps)(KeyValuesDialog);
