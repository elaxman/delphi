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
  Message,
  User,
  addMessage,
  getMessage,
  getMessages,
  getViewer,
  removeMessage,
} from './database';

var { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Message') {
      return getMessage(id);
    } else if (type === 'User') {
      return getViewer();
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Message) {
      return GraphQLMessage;
    } else if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  }
);

var GraphQLMessage = new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: globalIdField('Message'),
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
  },
  interfaces: [nodeInterface],
});

var {
  connectionType: MessagesConnection,
  edgeType: GraphQLMessageEdge,
} = connectionDefinitions({ name: 'Message', nodeType: GraphQLMessage });

var GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    messages: {
      type: MessagesConnection,
      args: connectionArgs,
      resolve: (obj, args) => connectionFromArray(getMessages(), args),
    },
  },
  interfaces: [nodeInterface],
});

var Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
    node: nodeField,
  },
});

var GraphQLAddMessageMutation = mutationWithClientMutationId({
  name: 'AddMessage',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    messageEdge: {
      type: GraphQLMessageEdge,
      resolve: ({ messageID }) => {
        var message = getMessage(messageID);
        return {
          cursor: cursorForObjectInConnection(getMessages(), message),
          node: message,
        };
      },
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({ text }) => {
    var messageID = addMessage(text);
    return { messageID };
  },
});

var GraphQLRemoveMessageMutation = mutationWithClientMutationId({
  name: 'RemoveMessage',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedMessageId: {
      type: GraphQLID,
      resolve: ({ id }) => id,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({ id }) => {
    var messageID = fromGlobalId(id).id;
    removeMessage(messageID);
    return { id };
  },
});

var Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMessage: GraphQLAddMessageMutation,
    removeMessage: GraphQLRemoveMessageMutation,
  },
});

export var Schema = new GraphQLSchema({
  query: Root,
  mutation: Mutation,
});
