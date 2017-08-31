import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddStopPlaceSuggestionListItem from './AddStopPlaceSuggestionListItem';

class AddStopPlaceSuggestionList extends Component {

  render() {

    const { suggestions, onItemCheck, checkedItems } = this.props;

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
        { !suggestions.length && <div>Ingen stoppesteder i nærheten ...</div>}
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
