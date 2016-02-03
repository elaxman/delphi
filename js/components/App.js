import React from 'react';
import Relay from 'react-relay';

import AddMessageMutation from '../mutations/AddMessageMutation';

import MessageCreation from './MessageCreation';
import MessagesList from './MessagesList';

class App extends React.Component {

  _handleMessageCreationSave = (text) => {
    Relay.Store.commitUpdate(
      new AddMessageMutation({text, viewer: this.props.viewer})
    );
  };

  render() {
    return (
      <div>
        <h1>Messages</h1>

        <MessagesList viewer={this.props.viewer} />

        <MessageCreation
          className="new-item"
          onSave={this._handleMessageCreationSave}
          placeholder="Enter your message"
        />
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${MessagesList.getFragment('viewer')},
        ${AddMessageMutation.getFragment('viewer')},
      }
    `,
  },
});
