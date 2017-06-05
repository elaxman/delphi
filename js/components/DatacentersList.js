import React from 'react';
import Relay from 'react-relay';

import DatacentersListItem from './DatacentersListItem';

class DatacentersList extends React.Component {
  render() {
    const { cloud } = this.props;

    return (
      <section className="datacenters">
        <ul>
          {this.props.cloud.datacenters.edges.map(edge =>
            <DatacentersListItem key={edge.node.id} datacenter={edge.node} cloud={cloud} />
          )}
        </ul>
      </section>
    );
  }
}

export default Relay.createContainer(DatacentersList, {
  fragments: {
    cloud: () => Relay.QL`
      fragment on Cloud {
        id,
        datacenters(last: 20) {
          edges {
            node {
              id,
              ${DatacentersListItem.getFragment('datacenter')},
            },
          },
        },
      }
    `,
  },
});
