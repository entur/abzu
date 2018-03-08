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
import MdClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import { withApollo } from 'react-apollo';
import TagItem from './TagItem';
import { removeTag, getTags } from '../../graphql/Tiamat/actions';
import AddTagDialog from './AddTagDialog';
import { connect } from 'react-redux';
import RefreshIndicator from 'material-ui/RefreshIndicator';

class TagsDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }


  handleDeleteTag(name, idReference) {
    const { client } = this.props;
    this.setState({isLoading: true});
    removeTag(client, name, idReference).then( result => {
      getTags(client, idReference).then( result => {
        this.setState({isLoading: false});
      }).catch(err => {
        this.setState({isLoading: false});
      });
    }).catch( err => {
      this.setState({isLoading: false})
    });
  }

  render() {
    const { open, tags, handleClose, intl, idReference } = this.props;
    const { formatMessage } = intl;
    const { isLoading } = this.state;

    if (!open) return null;

    const style = {
      position: 'fixed',
      left: 400,
      top: 105,
      background: '#fff',
      border: '1px solid black',
      width: 'auto',
      minWidth: 400,
      zIndex: 999
    };

    return (
      <div style={style}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 5
          }}
        >
          <div
            style={{
              marginTop: 8,
              marginLeft: 10,
              fontWeight: 600
            }}
          >
            <div>
              <div>{formatMessage({ id: 'tags' })}</div>
              { isLoading && <RefreshIndicator size={20} left={100} top={15} status="loading"/> }
            </div>
          </div>
          <IconButton
            style={{ marginRight: 5 }}
            onTouchTap={() => {
              handleClose();
            }}
          >
            <MdClose />
          </IconButton>
        </div>
        <div>
          {tags && tags.length
            ? tags.map((tag, i) => (
              <div key={'divider-'+i} style={{borderBottom: '1px solid #eee'}}>
                <TagItem
                  key={'tag-item' + i}
                  handleDelete={this.handleDeleteTag.bind(this)}
                  tag={tag}
                />
                <div style={{fontSize: '0.8em', padding: '0 25px', color: '#4b4b4b', marginBottom: 2}}>{tag.comment}</div>
              </div>
            ))
            : <span
                style={{
                  paddingBottom: 10,
                  textAlign: 'center',
                  fontSize: '0.9em',
                  width: '100%',
                  display: 'inline-block'
                }}
              >
              {formatMessage({id: 'no_tags'})}
              </span>}
        </div>
        <AddTagDialog idReference={idReference} handleLoading={isLoading => {
          this.setState({
            isLoading
          });
        }}/>
      </div>
    );
  }
}

const mapStateToProps = ({stopPlace}) => ({
  idReference: stopPlace.current.id
});

export default withApollo(connect(mapStateToProps)(TagsDialog));
