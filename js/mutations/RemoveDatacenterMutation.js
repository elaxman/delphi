import Relay from 'react-relay';

export default class RemoveDatacenterMutation extends Relay.Mutation {
  static fragments = {
    datacenter: () => Relay.QL`
      fragment on Datacenter {
        id,
        text,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{removeDatacenter}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveDatacenterPayload {
        deletedDatacenterId,
        cloud {
          id,
          datacenters,
        },
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'cloud',
      parentID: this.props.cloud.id,
      connectionName: 'datacenters',
      deletedIDFieldName: 'deletedDatacenterId',
    }];
  }

  getVariables() {
    return {
      id: this.props.datacenter.id,
    };
  }

  getOptimisticResponse() {
    return {
      deletedTodoId: this.props.datacenter.id,
      cloud: { id: this.props.cloud.id },
    };
  }
}
