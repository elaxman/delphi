import React from 'react';
import Relay from 'react-relay';

import moment from 'moment';

import RemoveMessageMutation from '../mutations/RemoveMessageMutation';

class MessagesListItem extends React.Component {

  _handleDestroyClick = () => {
    this._removeMessage();
  };

  _removeMessage() {
    Relay.Store.commitUpdate(
      new RemoveMessageMutation({message: this.props.message, viewer: this.props.viewer})
    );
  };

  render() {
    var { text, timestamp} = this.props.message;
    return (
      <li className="message">
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

export default Relay.createContainer(MessagesListItem, {
  fragments: {
    message: () => Relay.QL`
      fragment on Message {
        id,
        text,
        timestamp,
        ${RemoveMessageMutation.getFragment('message')},
      }
    `,
  },
});
