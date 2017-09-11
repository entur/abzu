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
    }

    return (
      <div style={{display: 'flex', alignItems: 'center', width: '95%', margin: 'auto'}}>
        <div style={columnStyle}>
          <Tag hideHint={true} data={tag}/>
        </div>
        <div style={{...columnStyle, flex: 3}}>
          {tag.createdBy || 'N/A'}
        </div>
        <div style={{...columnStyle, flex: 3}}>
          {moment(tag.created).locale('nb').format('DD-MM-YYYYHH:mm')}
        </div>
        <div style={{...columnStyle, flex: 1}}>
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
