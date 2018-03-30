import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';

import {
  globalIdField,
  fromGlobalId,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId, context, info) => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return Users[id];
    }
    return null;
  },
  (obj) => {
    return userType;
  }
);

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  interfaces: [nodeInterface],
});

const Users = [
  {
    id: 1,
    name: 'Mark Twain',
  },
  {
    id: 2,
    name: 'Ernest Hemingway',
  },
];

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: GraphQLNonNull(GraphQLList(
        GraphQLNonNull(userType))
      ),
      resolve() {
        return Users;
      },
    },
    user: {
      type: userType,
      resolve() {
        return Users[0];
      }
    },
  },
});

const changeNameMutation = mutationWithClientMutationId({
  name: 'ChangeName',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    renamedUser: {
      type: userType,
    },
  },
  mutateAndGetPayload({ id, name }) {
    console.log('mutation: ', id, name);
    const { id: userID } = fromGlobalId(id);
    console.log('id: ', userID);
    const user = Users.find(model => model.id == userID);
    if (!user) {
      throw new Error('invalid user id: ' + id);
    }
    user.name = name;
    return { renamedUser: user };
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    changeName: changeNameMutation,
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});