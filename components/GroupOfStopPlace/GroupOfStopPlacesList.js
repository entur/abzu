import React, {Component} from 'react';
import StopPlaceListItem from '../EditParentStopPage/StopPlaceListItem';
import { injectIntl } from 'react-intl';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


class GroupOfStopPlacesList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: -1
    }
  };

  render() {

    const { stopPlaces } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <div
          style={{
            padding: 5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '.9em' }}>
            {formatMessage({id: 'stop_places'})}
            {false ? <Loader/> : null}
          </div>
          <FloatingActionButton
            onClick={() => {}}
            disabled={false}
            mini={true}
            style={{ marginLeft: 20, marginBottom: 10 }}
          >
            <ContentAdd />
          </FloatingActionButton>
        </div>
        { stopPlaces.map((stopPlace, i) => (
          <StopPlaceListItem
            key={'group-item-' + i}
            stopPlace={stopPlace}
            expanded={false}
            handleExpand={value => {
              this.setState({
                expanded: value
              })
            }}
            handleCollapse={() => {
              this.setState({
                expanded: -1
              });
            }}
            disabled={false}
          />
        ))}
        { !stopPlaces.length && <p>No stop places</p>}
      </div>
    );
  }
}

GroupOfStopPlacesList.propTypes = {};
GroupOfStopPlacesList.defaultProps = {
  stopPlaces: []
};

export default injectIntl(GroupOfStopPlacesList);
