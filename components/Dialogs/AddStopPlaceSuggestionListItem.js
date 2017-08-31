import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import ModalityIcon from '../MainPage/ModalityIcon';

class AddStopPlaceSuggestionListItem extends Component {
  render() {

    const { suggestion, checked, onCheck } = this.props;

    return (
      <div style={{display: 'flex', alignItems: 'center', padding: 4}}>
        <Checkbox checked={checked} onCheck={(e,v) => onCheck(suggestion.id, v)} label={
          <div style={{display: 'flex', alignItems: 'center'}}>
            <ModalityIcon type={suggestion.stopPlaceType} submode={suggestion.submode} iconStyle={{marginTop: -1}}/>
            <div style={{fontSize: '0.9em', flex: 0.8}}>{suggestion.name}</div>
            <div style={{fontSize: '0.8em', lineHeight: '1.2em', flex: 0.5}}>{suggestion.id}</div>
          </div>
        }/>
      </div>
    );
  }
}

AddStopPlaceSuggestionListItem.propTypes = {
  suggestion: PropTypes.object.isRequired
};

export default AddStopPlaceSuggestionListItem;
