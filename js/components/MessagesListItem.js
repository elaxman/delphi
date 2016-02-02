import React from 'react';
import Relay from 'react-relay';

import RemoveMessageMutation from '../mutations/RemoveMessageMutation';

class MessagesListItem extends React.Component {

  _handleDestroyClick = () => {
    this._removeMessage();
  };

  _removeMessage() {
    Relay.Store.commitUpdate(
      new RemoveMessageMutation({todo: this.props.message})
    );
  };

  render() {
    return (
      <li>{this.props.message.text} (ID: {this.props.message.id})</li>
    );
  }
}

export default Relay.createContainer(MessagesListItem, {
  fragments: {
    message: () => Relay.QL`
      fragment on Message {
        id,
        text,
        ${RemoveMessageMutation.getFragment('message')},
      }
    `,
  },
});
