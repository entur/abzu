import React, {Component} from 'react';
import Tag from './Tag';

class TagTray extends Component {
  render() {

    const { tags } = this.props;

    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        { tags.map( (tag, i) => <Tag key={"tag-"+i} data={tag}/>) }
      </div>
    );
  }
}

export default TagTray;
