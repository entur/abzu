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
