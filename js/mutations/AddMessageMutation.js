import Relay from 'react-relay';

export default class AddMessageMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{addMessage}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddMessagePayload {
        messageEdge,
        viewer {
          messages,
        },
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'messages',
      edgeName: 'messageEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }

  getVariables() {
    return {
      text: this.props.text,
      timestamp: this.props.timestamp,
    };
  }

  getOptimisticResponse() {
    return {
      messageEdge: {
        node: {
          text: this.props.text,
          timestamp: this.props.timestamp,
        },
      },
      viewer: {
        id: this.props.viewer.id,
      },
    };
  }
}
