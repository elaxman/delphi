import React from 'react';
import Relay from 'react-relay';

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
    return (
      <li><span>{this.props.message.text}</span> <button onClick={this._handleDestroyClick}>Delete</button></li>
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
