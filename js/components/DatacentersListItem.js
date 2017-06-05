import React from 'react';
import Relay from 'react-relay';

import moment from 'moment';

import RemoveDatacenterMutation from '../mutations/RemoveDatacenterMutation';

class DatacentersListItem extends React.Component {

  _handleDestroyClick = () => {
    this._removeDatacenter();
  };

  _removeDatacenter() {
    Relay.Store.commitUpdate(
      new RemoveDatacenterMutation({datacenter: this.props.datacenter, cloud: this.props.cloud})
    );
  };

  render() {
    var { text, timestamp} = this.props.datacenter;
    return (
	<li className="datacenter">
        <div className="timestamp">
          <span>{moment(timestamp).format('H:mm')}</span>
        </div>
        <div className="text">
          <span>{text}</span>
        </div>
        <div className="delete-btn">
          <button onClick={this._handleDestroyClick}>Delete</button>
        </div>
	</li>
    );
  }
}

export default Relay.createContainer(DatacentersListItem, {
  fragments: {
    datacenter: () => Relay.QL`
      fragment on Datacenter {
        id,
        text,
        timestamp,
        ${RemoveDatacenterMutation.getFragment('datacenter')},
      }
    `,
  },
});
