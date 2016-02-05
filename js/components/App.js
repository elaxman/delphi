import React from 'react';
import Relay from 'react-relay';

import AddMessageMutation from '../mutations/AddMessageMutation';

import MessageCreation from './MessageCreation';
import MessagesList from './MessagesList';

class App extends React.Component {

  _handleMessageCreationSave = ({text, timestamp}) => {
    Relay.Store.commitUpdate(
      new AddMessageMutation({text, timestamp, viewer: this.props.viewer})
    );
  };

  render() {
    return (
      <div>
        <div className="title">Messages / TODO list</div>
        <div className="chat">
          <MessagesList viewer={this.props.viewer} />

          <MessageCreation
            className="input"
            onSave={this._handleMessageCreationSave}
            placeholder='Enter your message/TODO and press "Enter"'
          />
        </div>
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
