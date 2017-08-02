import React from 'react';
import ScrollableQuayItem from './ScrollableQuayItem';
import { enturPrimary } from '../../config/enturTheme';

class ScrollableQuayList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedQuays: [props.defaultQuayId]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultQuayId !== nextProps.defaultQuayId) {
      this.setState({
        checkedQuays: [nextProps.defaultQuayId]
      });
    }
  }

  handleCheck(value, id) {
    const { checkedQuays } = this.state;
    let newcheckedQuays = value
      ? checkedQuays.concat(id)
      : checkedQuays.filter( quayId => quayId !== id )

    this.setState({
      checkedQuays: newcheckedQuays
    });
    this.props.handleUpdate(newcheckedQuays);
  }

  render() {
    const { style, quays } = this.props;
    const { checkedQuays } = this.state;
    const innerDivStyle = {
      height: 300,
      overflow: 'scroll',
      border: '1px solid #777'
    };

    const allowedQuays = quays.filter(quay => !!quay.id);

    return (
      <div style={style}>
        <div style={innerDivStyle}>
          {allowedQuays.map(quay =>
            <ScrollableQuayItem
              key={quay.id}
              quay={quay}
              handleCheck={this.handleCheck.bind(this)}
              checked={checkedQuays.indexOf(quay.id) > -1}
            />
          )}
        </div>
        <div style={{textAlign: 'center', background: enturPrimary, color: '#fff', padding: 2}}>{checkedQuays.length} valgt</div>
      </div>
    );
  }
}

export default ScrollableQuayList;
