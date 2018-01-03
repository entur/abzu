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
import Checkbox from 'material-ui/Checkbox';
import ModalityIconImg from '../MainPage/ModalityIconImg';
import { injectIntl } from 'react-intl';
import HasExpiredInfo from '../MainPage/HasExpiredInfo';

class AddStopPlaceSuggestionListItem extends Component {

  render() {

    const { suggestion, checked, onCheck, intl } = this.props;
    const { formatMessage } = intl;

    return (
      <div style={{display: 'flex', alignItems: 'center', padding: 4}}>
        <Checkbox disabled={suggestion && suggestion.hasExpired} checked={checked} onCheck={(e,v) => onCheck(suggestion.id, v)} label={
          <div style={{display: 'flex', alignItems: 'center'}}>
            {suggestion.isParent
              ? <div style={{marginRight: 5, fontWeight: 600}}>MM</div>
              : <ModalityIconImg
                  type={suggestion.stopPlaceType}
                  submode={suggestion.submode}
                  style={{marginRight: 5}}
                  iconStyle={{marginTop: -1}}
              />
            }
            <div style={{fontSize: '0.9em', flex: 0.8}}>
              { suggestion.name
                ? <span>{suggestion.name}</span>
                : <span style={{fontStyle: 'italic', fontSize: '0.8em'}}>{formatMessage({id: 'is_missing_name'})}</span>
              }
              </div>
            <div style={{fontSize: '0.8em', lineHeight: '1.2em', flex: 1.5, display: 'flex'}}>
              <div style={{flex: 3}}>
                <div>{suggestion.id}</div>
              </div>
              <HasExpiredInfo show={suggestion.hasExpired} formatMessage={formatMessage}/>
            </div>
          </div>
          }
        />
      </div>
    );
  }
}

AddStopPlaceSuggestionListItem.propTypes = {
  suggestion: PropTypes.object.isRequired
};

export default injectIntl(AddStopPlaceSuggestionListItem);
