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
import { removeTag, getTags } from '../../graphql/Actions';
import AddTagDialog from './AddTagDialog';
import { connect } from 'react-redux';


class TagsDialog extends Component {

  handleDeleteTag(name, idReference) {
    const { client } = this.props;
    removeTag(client, name, idReference).then( result => {
      getTags(client, idReference);
    });
  }

  render() {
    const { open, tags, handleClose, intl, idReference } = this.props;
    const { formatMessage } = intl;

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
              fontWeight: 60,
              marginLeft: 10,
              fontWeight: 600
            }}
          >
            {formatMessage({ id: 'tags' })}
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
              <TagItem
                key={'tag-item' + i}
                handleDelete={this.handleDeleteTag.bind(this)}
                tag={tag}
              />
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
                Ingen tagger
              </span>}
        </div>
        <AddTagDialog idReference={idReference}/>
      </div>
    );
  }
}

const mapStateToProps = ({stopPlace}) => ({
  idReference: stopPlace.current.id
});

export default withApollo(connect(mapStateToProps)(TagsDialog));
