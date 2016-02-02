import React from 'react';
import Relay from 'react-relay';

import MessagesListItem from './MessagesListItem';

class MessagesList extends React.Component {
  render() {
    return (
      <section>
        <ul>
          {this.props.viewer.messages.edges.map(edge =>
            <MessagesListItem key={edge.node.id}message={edge.node} />
          )}
        </ul>
      </section>
    );
  }
}

export default Relay.createContainer(MessagesList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        messages(last: 20) {
          edges {
            node {
              id,
              ${MessagesListItem.getFragment('message')},
            },
          },
        },
      }
    `,
  },
});
