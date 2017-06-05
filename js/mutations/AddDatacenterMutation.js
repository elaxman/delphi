import Relay from 'react-relay';

export default class AddDatacenterMutation extends Relay.Mutation {
  static fragments = {
    cloud: () => Relay.QL`
      fragment on Cloud {
        id,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{addDatacenter}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddDatacenterPayload {
        datacenterEdge,
        cloud {
          datacenters,
        },
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'cloud',
      parentID: this.props.cloud.id,
      connectionName: 'datacenters',
      edgeName: 'datacenterEdge',
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
      datacenterEdge: {
        node: {
          text: this.props.text,
          timestamp: this.props.timestamp,
        },
      },
      cloud: {
        id: this.props.cloud.id,
      },
    };
  }
}
