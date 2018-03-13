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
import AutoComplete from 'material-ui/AutoComplete';
import { withApollo } from 'react-apollo';
import debounce from 'lodash.debounce';
import { findTagByName } from '../../graphql/Tiamat/actions';
import MenuItem from 'material-ui/MenuItem';
import { toCamelCase } from '../../utils/';
import { injectIntl } from 'react-intl';

class AddTagAutoComplete extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      chosen: '',
    };

    this.findTag = debounce(name => {
      findTagByName(props.client, name.toLowerCase()).then(response => {
        this.setState({
          dataSource: response.data.tags
        });
      });
    }, 500);
  }

  handleSelectedTag({text, comment}) {
    const tagInCamelCase = toCamelCase(text);
    this.props.handleChooseTag(tagInCamelCase, comment);
    this.setState({
      chosen: text
    });
  }

  handleBlur(event) {
    const value = event.target.value;
    const { dataSource } = this.state;
    const isFoundInDataSource = dataSource.find(item => item.name.toLowerCase() === value.toLowerCase());

    if (value) {
      if (isFoundInDataSource) {
        this.handleSelectedTag({
          text: isFoundInDataSource.name
        });
      } else {
        this.handleSelectedTag({text: value});
      }
    }
  }

  getMenuItems(dataSource = [], searchText) {
    let menuItems = [];

    if (!searchText) return menuItems;

    const isFoundInDataSource = dataSource.some(item => item.name.toLowerCase() === searchText.toLowerCase());

    if (dataSource.length) {

      const suggestion = {
        text: 'TAG_SUGGESTION',
        value: (
          <MenuItem
            disabled={true}
            key={'tag-menu-suggestion'}
            innerDivStyle={{margin: '-12px 0px'}}
            primaryText={
              <div style={{fontWeight: 600, fontSize: '0.8em'}}>Forslag:</div>
            }
          />
        )
      };

       menuItems = menuItems.concat(suggestion, dataSource.map((tag, i) => {
        return {
          text: tag.name,
          comment: tag.comment,
          value: (
            <MenuItem
              key={'tag-menu-item' + i}
              style={{ paddingRight: 10, width: 'auto' }}
              innerDivStyle={{margin: '-5px 0px'}}
              primaryText={tag.name}
            />
          )
        };
      }));
    }

    if (!isFoundInDataSource) {
      menuItems.push({
        text: searchText.toLowerCase(),
        comment: '',
        value: (
          <MenuItem
            key={'tag-menu-create'}
            style={{ paddingRight: 10, width: 'auto' }}
            primaryText={
              <div style={{borderTop: '1px solid #eee', fontSize: '0.8em'}}>
                <span style={{fontWeight: 600}}>{toCamelCase(searchText)}</span>
                <span style={{marginLeft: 5}}>
                  {this.props.intl.formatMessage({id: 'new_tag_hint'})}
                </span>
              </div>
            }
          />
        )
      });
    }
    return menuItems;
  }

  handleUpdate(searchText) {
    this.props.handleInputChange(searchText);
    this.findTag(searchText);
  }


  render() {
    const { dataSource } = this.state;
    const { style, searchText, intl } = this.props;
    const { formatMessage } = intl;
    const menuItems = this.getMenuItems(dataSource, searchText);

    return (
      <AutoComplete
        searchText={searchText}
        floatingLabelText={formatMessage({id: 'tag'})}
        dataSource={menuItems}
        maxSearchResults={7}
        style={style}
        onNewRequest={this.handleSelectedTag.bind(this)}
        onBlur={(e,v) => this.handleBlur(e)}
        fullWidth={true}
        filter={() => true}
        onUpdateInput={this.handleUpdate.bind(this)}
      />
    );
  }
}

export default withApollo(injectIntl(AddTagAutoComplete));
