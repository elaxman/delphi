import React from 'react';
import Relay from 'react-relay';

import AddMessageMutation from '../mutations/AddMessageMutation';

import MessageCreation from './MessageCreation';

class App extends React.Component {

  _handleMessageCreationSave = (text) => {
    Relay.Store.commitUpdate(
      new AddMessageMutation({text, viewer: this.props.viewer})
    );
  };

  render() {
    return (
      <div>
        <h1>Items list</h1>
        <ul>
          {this.props.viewer.messages.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.text} (ID: {edge.node.id})</li>
          )}
        </ul>

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
        messages(first: 10) {
          edges {
            node {
              id,
              text,
            },
          },
        },
        ${AddMessageMutation.getFragment('viewer')},
      }
    `,
  },
});
