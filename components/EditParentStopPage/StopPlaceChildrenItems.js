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


import React, { Component } from 'react';
import StopPlaceListChildItem from './StopPlaceListChildItem';

class StopPlaceChildrenItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expandedChild: -1
    }
  }

  render() {
    const { children, formatMessage } = this.props;
    const { expandedChild } = this.state;

    return (
      <div style={{width: '90%', margin: 'auto'}}>
        <span style={{fontWeight: 600, fontSize: '0.8em', textTransform: 'capitalize'}}>
          {formatMessage({id: 'children_of_parent_stop_place'})}
        </span>
        {children.map((child, i) =>
          <StopPlaceListChildItem
            key={child.id}
            child={child}
            expanded={expandedChild === i}
            handleCollapse={() => this.setState({expandedChild: -1})}
            handleExpand={() => this.setState({expandedChild: i})}
          />
        )}
      </div>
    );
  }
}

export default StopPlaceChildrenItems;
