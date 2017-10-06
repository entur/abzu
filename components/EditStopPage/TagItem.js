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
import Tag from '../MainPage/Tag';
import moment from 'moment';
import MdDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';

class TagItem extends Component {
  render() {

    const { tag, handleDelete } = this.props;
    const columnStyle = {
      flex: 1,
      fontSize: '0.8em',
      padding: 5
    };

    return (
      <div style={{display: 'flex', alignItems: 'center', width: '95%', margin: 'auto'}}>
        <div style={{...columnStyle, flex: 3.5}}>
          <Tag hideHint={true} data={tag}/>
        </div>
        <div style={{...columnStyle, flex: 3, fontSize: '0.7em'}}>
          {tag.createdBy || 'N/A'}
        </div>
        <div style={{...columnStyle, flex: 3, fontSize: '0.7em'}}>
          {moment(tag.created).locale('nb').format('DD-MM-YYYY HH:mm')}
        </div>
        <div style={{...columnStyle, flex: 1, padding: 0}}>
          <IconButton
              onClick={() => handleDelete(tag.name, tag.idReference)}
            >
            <MdDelete color="rgb(223, 84, 74)"/>
          </IconButton>
        </div>
      </div>
    );
  }
}

export default TagItem;
