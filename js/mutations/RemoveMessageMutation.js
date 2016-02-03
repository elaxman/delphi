import Relay from 'react-relay';

export default class RemoveMessageMutation extends Relay.Mutation {
  static fragments = {
    message: () => Relay.QL`
      fragment on Message {
        id,
        text,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{removeMessage}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveMessagePayload {
        deletedMessageId,
        viewer {
          id,
          messages,
        },
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'messages',
      deletedIDFieldName: 'deletedMessageId',
    }];
  }

  getVariables() {
    return {
      id: this.props.message.id,
    };
  }

  getOptimisticResponse() {
    return {
      deletedTodoId: this.props.message.id,
      viewer: { id: this.props.viewer.id },
    };
  }
}
