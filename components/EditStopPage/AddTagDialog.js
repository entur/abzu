import React, {Component} from 'react';
import { withApollo } from 'react-apollo';
import AddTagAutoComplete from './AddTagAutoComplete';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { addTag, getTags } from '../../graphql/Actions';
import Tag from '../MainPage/Tag';
import { injectIntl } from 'react-intl';


class AddTagDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      tagName: '',
      searchText: '',
    }
  }

  handleChooseTag(tagName, comment) {
    if (!tagName) {
      this.setState({
        searchText: ''
      });
      return;
    }
    if (comment) {
      this.setState({
        tagName,
        comment,
        searchText: '',
      })
    } else {
      this.setState({
        tagName,
        searchText: '',
      })
    }
  }

  handleAddTag() {
    const { comment, tagName } = this.state;
    const { client, idReference } = this.props;

    addTag(client, idReference, tagName, comment).then( result => {
      this.setState({
        comment: '',
        tagName: '',
        searchText: ''
      });
      getTags(client, idReference);
    });
  }

  getTagData() {
    const { comment, tagName} = this.state;
    return ({
      name: tagName,
      comment
    })
  }

  render() {

    const { comment, tagName, searchText } = this.state;
    const { intl } = this.props;
    const { formatMessage } = intl;
    const tagData = this.getTagData();

    return (
      <div style={{borderTop: '1px dotted', display: 'flex', flexDirection: 'column', marginLeft: 5, paddingBottom: 5}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <AddTagAutoComplete
            style={{marginLeft: 10,flex: 3}}
            tagName={tagName}
            searchText={searchText}
            handleInputChange={value => { this.setState({searchText: value})}}
            handleChooseTag={this.handleChooseTag.bind(this)}
          />
          <div style={{flex: 1}}>
            <Tag data={tagData}/>
          </div>
        </div>
        <TextField
          value={comment}
          floatingLabelText={formatMessage({id: 'comment'})}
          hintText={formatMessage({id: 'comment'})}
          style={{marginLeft: 10, width: 350}}
          id={"comment-text"}
          onChange={(e,v) => this.setState({comment: v || ''})}
        />
        <FlatButton
          label={formatMessage({id: 'add'})}
          style={{width: '30%', margin: 'auto'}}
          disabled={!tagName}
          onClick={this.handleAddTag.bind(this)}
        />
      </div>
    );
  }
}


export default withApollo(injectIntl(AddTagDialog));
