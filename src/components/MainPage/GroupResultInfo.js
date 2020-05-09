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
import MdGroup from 'material-ui/svg-icons/action/group-work';
import CircularNumber from './CircularNumber';
import { getPrimaryDarkerColor } from '../../config/themeConfig';
import StopPlaceLink from '../ReportPage/StopPlaceLink';


class GroupResultInfo extends Component {

  render() {

    const { result, formatMessage } = this.props;

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 0
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 600 }}>{result.name}</div>
          <MdGroup style={{margin: 5}}/>
        </div>
        <div>{formatMessage({id: 'group_of_stop_places'})}</div>
        <div style={{ display: 'flex', justifyItems: 'center', padding: '10px 5px', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 16, textTransform: 'capitalize' }}>
            {formatMessage({ id: 'stop_places' })}
          </div>
          <div style={{ marginLeft: 5 }}>
            <CircularNumber number={result.members.length} color={getPrimaryDarkerColor()} />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 10,
            maxHeight: 150,
            overflow: 'auto',
            width: '95%',
            margin: '0px auto 20px auto'
          }}
        >
          {result.members.map((member, i) =>
            <div
              key={'q-importedID' + member.id}
              style={{
                borderBottom: '1px solid #0078a8',
                background: i % 2 ? '#f8f8f8' : '#fff',
                padding: 2,
                marginBottom: 5,
              }}
            >
              <div style={{display: 'flex', fontSize: '0.8rem', justifyContent: 'space-between'}}>
                <div>{member.name}</div>
                <div style={{marginLeft: 5}}>
                  <StopPlaceLink id={member.id}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

GroupResultInfo.propTypes = {
  result: PropTypes.object.isRequired,
  formatMessage: PropTypes.func.isRequired
};

export default GroupResultInfo;
