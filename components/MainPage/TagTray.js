import React, {Component} from 'react';
import Tag from './Tag';

class TagTray extends Component {

  render() {
    const { tags, textSize, direction, align } = this.props;

    return (
      <div style={{display: 'flex', alignItems: align  || 'center', flexDirection: direction || 'row'}}>
        { tags.map( (tag, i) => <Tag textSize={textSize} key={"tag-"+i} data={tag}/>) }
      </div>
    );
  }
}

export default TagTray;
