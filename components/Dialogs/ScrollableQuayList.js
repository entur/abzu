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

import React from 'react';
import ScrollableQuayItem from './ScrollableQuayItem';
import { getPrimaryColor } from '../../config/themeConfig';

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
      : checkedQuays.filter(quayId => quayId !== id);

    this.setState({
      checkedQuays: newcheckedQuays
    });
    this.props.handleUpdate(newcheckedQuays);
  }

  render() {
    const { style, quays, formatMessage } = this.props;
    const { checkedQuays } = this.state;
    const innerDivStyle = {
      height: 300,
      overflowY: 'auto',
      overflowX: 'auto',
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
        <div
          style={{
            background: getPrimaryColor(),
            color: '#fff',
            padding: 2,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div>{checkedQuays.length}</div>
          <div style={{marginLeft: 5}}>{formatMessage({id: 'chosen'})}</div>
        </div>
      </div>
    );
  }
}

export default ScrollableQuayList;
