import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddStopPlaceSuggestionListItem from './AddStopPlaceSuggestionListItem';

class AddStopPlaceSuggestionList extends Component {

  render() {

    const { suggestions, onItemCheck, checkedItems, formatMessage } = this.props;
    const noStopSNearby = formatMessage({id: 'no_stops_nearby'});

    return (
      <div>
        { suggestions.map( suggestion => (
            <AddStopPlaceSuggestionListItem
              key={suggestion.id}
              onCheck={onItemCheck}
              checked={checkedItems.indexOf(suggestion.id) > -1}
              suggestion={suggestion}
            />
        ))}
        { !suggestions.length && <div>{noStopSNearby}</div>}
      </div>
    );
  }
}

AddStopPlaceSuggestionList.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onItemCheck: PropTypes.func.isRequired,
  checkedItems: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default AddStopPlaceSuggestionList;
