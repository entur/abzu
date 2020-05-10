import React from 'react';
import { injectIntl } from 'react-intl';
import CoordinatesDialog from '../Dialogs/CoordinatesDialog';
import Divider from 'material-ui/Divider';

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinatesDialogOpen: false,
    };
  }

  render() {
    const {children, intl, handleChangeCoordinates } = this.props;
    return (
      <div>
        {children}
        <Divider style={{ marginTop: 2 }} />
        <CoordinatesDialog
          open={this.state.coordinatesDialogOpen}
          intl={intl}
          handleConfirm={handleChangeCoordinates}
          handleClose={() => {
            this.setState({ coordinatesDialogOpen: false });
          }}
        />
      </div>
    );
  }
}

export default injectIntl(Item);
