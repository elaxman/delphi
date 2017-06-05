import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Datacenter,
  Cloud,
  addDatacenter,
  getDatacenter,
  getDatacenters,
  getCloud,
  removeDatacenter,
} from './database';

var { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Datacenter') {
      return getDatacenter(id);
    } else if (type === 'Cloud') {
      return getCloud();
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Datacenter) {
      return GraphQLDatacenter;
    } else if (obj instanceof Cloud) {
      return GraphQLCloud;
    }
    return null;
  }
);

var GraphQLDatacenter = new GraphQLObjectType({
  name: 'Datacenter',
  fields: {
    id: globalIdField('Datacenter'),
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
    timestamp: {
      type: GraphQLString,
      resolve: (obj) => obj.timestamp,
    },
  },
  interfaces: [nodeInterface],
});

var {
  connectionType: DatacentersConnection,
  edgeType: GraphQLDatacenterEdge,
} = connectionDefinitions({ name: 'Datacenter', nodeType: GraphQLDatacenter });

var GraphQLCloud = new GraphQLObjectType({
  name: 'Cloud',
  fields: {
    id: globalIdField('Cloud'),
    datacenters: {
      type: DatacentersConnection,
      args: connectionArgs,
      resolve: (obj, args) => connectionFromArray(getDatacenters(), args),
    },
  },
  interfaces: [nodeInterface],
});

var Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    cloud: {
      type: GraphQLCloud,
      resolve: () => getCloud(),
    },
    node: nodeField,
  },
});

var GraphQLAddDatacenterMutation = mutationWithClientMutationId({
  name: 'AddDatacenter',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    timestamp: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    datacenterEdge: {
      type: GraphQLDatacenterEdge,
      resolve: ({ datacenterID }) => {
        var datacenter = getDatacenter(datacenterID);
        return {
          cursor: cursorForObjectInConnection(getDatacenters(), datacenter),
          node: datacenter,
        };
      },
    },
    cloud: {
      type: GraphQLCloud,
      resolve: () => getCloud(),
    },
  },
  mutateAndGetPayload: ({ text, timestamp }) => {
    var datacenterID = addDatacenter(text, timestamp);
    return { datacenterID };
  },
});

var GraphQLRemoveDatacenterMutation = mutationWithClientMutationId({
  name: 'RemoveDatacenter',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedDatacenterId: {
      type: GraphQLID,
      resolve: ({ id }) => id,
    },
    cloud: {
      type: GraphQLCloud,
      resolve: () => getCloud(),
    },
  },
  mutateAndGetPayload: ({ id }) => {
    var datacenterID = fromGlobalId(id).id;
    removeDatacenter(datacenterID);
    return { id };
  },
});

var Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDatacenter: GraphQLAddDatacenterMutation,
    removeDatacenter: GraphQLRemoveDatacenterMutation,
  },
});

export var Schema = new GraphQLSchema({
  query: Root,
  mutation: Mutation,
});
